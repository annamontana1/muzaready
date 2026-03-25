import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/customers
 * List customers with search, filter, pagination, sorting
 * Merges registered Users with guest emails from Orders
 *
 * Query Parameters:
 * - search: Search by name, email, phone, company name
 * - filter: "all" | "b2c" | "b2b" | "wholesale"
 * - sort: Sort field (default -createdAt). Prefix with - for descending
 *   Allowed: name, email, totalSpent, orderCount, createdAt
 * - limit: Items per page (1-100, default 50)
 * - offset: Pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search')?.trim() || '';
    const filter = searchParams.get('filter') || 'all';
    let limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortParam = searchParams.get('sort') || '-createdAt';

    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 100) limit = 100;

    const isDescending = sortParam.startsWith('-');
    const sortField = isDescending ? sortParam.slice(1) : sortParam;

    // ----- 1. Fetch registered users -----
    const userWhere: any = {};

    if (search) {
      userWhere.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filter === 'b2b') {
      userWhere.OR = [
        ...(userWhere.OR ? [{ AND: userWhere.OR }] : []),
        { isWholesale: true },
        { companyName: { not: null } },
      ];
      // If search was set, we need AND logic
      if (search) {
        const searchConditions = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
        ];
        userWhere.AND = [
          { OR: searchConditions },
          { OR: [{ isWholesale: true }, { companyName: { not: null } }] },
        ];
        delete userWhere.OR;
      } else {
        userWhere.OR = [
          { isWholesale: true },
          { companyName: { not: null } },
        ];
      }
    } else if (filter === 'b2c') {
      const b2cCondition = {
        AND: [
          { isWholesale: false },
          { OR: [{ companyName: null }, { companyName: '' }] },
        ],
      };
      if (search) {
        userWhere.AND = [
          {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { companyName: { contains: search, mode: 'insensitive' } },
            ],
          },
          b2cCondition,
        ];
        delete userWhere.OR;
      } else {
        Object.assign(userWhere, b2cCondition);
      }
    } else if (filter === 'wholesale') {
      if (search) {
        userWhere.AND = [
          {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { companyName: { contains: search, mode: 'insensitive' } },
            ],
          },
          { isWholesale: true },
        ];
        delete userWhere.OR;
      } else {
        userWhere.isWholesale = true;
      }
    }

    const users = await prisma.user.findMany({
      where: userWhere,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        isWholesale: true,
        wholesaleRequested: true,
        taxId: true,
        streetAddress: true,
        city: true,
        zipCode: true,
        country: true,
        businessType: true,
        status: true,
        createdAt: true,
      },
    });

    // ----- 2. Aggregate order data per email -----
    const orderAggregates = await prisma.order.groupBy({
      by: ['email'],
      _count: { id: true },
      _sum: { total: true },
      _min: { createdAt: true },
      _max: { createdAt: true },
      where: {
        orderStatus: { notIn: ['cancelled', 'draft'] },
      },
    });

    const orderMap = new Map(
      orderAggregates.map((agg) => [
        agg.email.toLowerCase(),
        {
          orderCount: agg._count.id,
          totalSpent: agg._sum.total || 0,
          firstOrder: agg._min.createdAt,
          lastOrder: agg._max.createdAt,
        },
      ])
    );

    // ----- 3. Build customer list from registered users -----
    const registeredEmails = new Set(users.map((u) => u.email.toLowerCase()));

    const registeredCustomers = users.map((user) => {
      const stats = orderMap.get(user.email.toLowerCase());
      const isB2B = user.isWholesale || (!!user.companyName && user.companyName.trim() !== '');
      return {
        id: user.id,
        source: 'registered' as const,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        companyName: user.companyName,
        isWholesale: user.isWholesale,
        taxId: user.taxId,
        type: isB2B ? 'B2B' : 'B2C',
        orderCount: stats?.orderCount || 0,
        totalSpent: stats?.totalSpent || 0,
        firstOrder: stats?.firstOrder || null,
        lastOrder: stats?.lastOrder || null,
        createdAt: user.createdAt,
      };
    });

    // ----- 4. Find guest customers (emails in Orders not in Users) -----
    // Only include guests when not filtering by b2b/wholesale (guests are B2C)
    let guestCustomers: typeof registeredCustomers = [];

    if (filter === 'all' || filter === 'b2c') {
      // Get distinct order emails with first/last names
      const guestOrders = await prisma.order.findMany({
        where: {
          orderStatus: { notIn: ['cancelled', 'draft'] },
          NOT: {
            email: { in: Array.from(registeredEmails) },
          },
          ...(search
            ? {
                OR: [
                  { email: { contains: search, mode: 'insensitive' as const } },
                  { firstName: { contains: search, mode: 'insensitive' as const } },
                  { lastName: { contains: search, mode: 'insensitive' as const } },
                  { phone: { contains: search, mode: 'insensitive' as const } },
                ],
              }
            : {}),
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Deduplicate by email, keeping latest info
      const guestMap = new Map<
        string,
        { email: string; firstName: string; lastName: string; phone: string | null; createdAt: Date }
      >();

      for (const order of guestOrders) {
        const key = order.email.toLowerCase();
        if (!guestMap.has(key)) {
          guestMap.set(key, {
            email: order.email,
            firstName: order.firstName,
            lastName: order.lastName,
            phone: order.phone,
            createdAt: order.createdAt,
          });
        }
      }

      guestCustomers = Array.from(guestMap.values()).map((guest) => {
        const stats = orderMap.get(guest.email.toLowerCase());
        return {
          id: `guest_${Buffer.from(guest.email.toLowerCase()).toString('base64url')}`,
          source: 'guest' as const,
          email: guest.email,
          firstName: guest.firstName,
          lastName: guest.lastName,
          phone: guest.phone,
          companyName: null,
          isWholesale: false,
          taxId: null,
          type: 'B2C' as const,
          orderCount: stats?.orderCount || 0,
          totalSpent: stats?.totalSpent || 0,
          firstOrder: stats?.firstOrder || null,
          lastOrder: stats?.lastOrder || null,
          createdAt: guest.createdAt,
        };
      });
    }

    // ----- 5. Merge and sort -----
    let allCustomers = [...registeredCustomers, ...guestCustomers];

    // Sort
    const allowedSorts = ['name', 'email', 'totalSpent', 'orderCount', 'createdAt'];
    const validSort = allowedSorts.includes(sortField) ? sortField : 'createdAt';

    allCustomers.sort((a, b) => {
      let cmp = 0;
      switch (validSort) {
        case 'name':
          cmp = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, 'cs');
          break;
        case 'email':
          cmp = a.email.localeCompare(b.email);
          break;
        case 'totalSpent':
          cmp = a.totalSpent - b.totalSpent;
          break;
        case 'orderCount':
          cmp = a.orderCount - b.orderCount;
          break;
        case 'createdAt':
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return isDescending ? -cmp : cmp;
    });

    // ----- 6. Summary stats -----
    const totalCustomers = allCustomers.length;
    const b2bCount = allCustomers.filter((c) => c.type === 'B2B').length;
    const totalSpentAll = allCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgSpent = totalCustomers > 0 ? totalSpentAll / totalCustomers : 0;

    // ----- 7. Paginate -----
    const paginated = allCustomers.slice(offset, offset + limit);

    return NextResponse.json({
      customers: paginated,
      total: totalCustomers,
      stats: {
        totalCustomers,
        b2bCount,
        avgSpent: Math.round(avgSpent),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Chyba pri nacitani zakazniku' },
      { status: 500 }
    );
  }
}
