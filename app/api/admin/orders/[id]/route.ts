import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin, verifyAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

/**
 * GET /api/admin/orders/[id]
 * Fetch single order with full details and items
 *
 * Response:
 * {
 *   id, email, firstName, lastName, phone, address fields...
 *   orderStatus, paymentStatus, deliveryStatus, channel, tags, riskScore,
 *   notesInternal, notesCustomer, total, subtotal, shippingCost, discountAmount,
 *   paymentMethod, deliveryMethod,
 *   items: [{ id, nameSnapshot, grams, pricePerGram, lineTotal, saleMode, skuId, sku: { id, sku, name, shadeName, lengthCm } }],
 *   createdAt, updatedAt, lastStatusChangeAt
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Try to include invoice, but handle case where table doesn't exist yet
    let includeInvoice = true;
    try {
      await prisma.$queryRaw`SELECT 1 FROM "invoices" LIMIT 1`;
    } catch (e) {
      includeInvoice = false;
      console.log('Invoice table does not exist yet, skipping invoice include');
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sku: {
              select: {
                id: true,
                sku: true,
                name: true,
                shadeName: true,
                lengthCm: true,
              },
            },
          },
        },
        ...(includeInvoice && {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              status: true,
              createdAt: true,
              pdfGenerated: true,
            },
          },
        }),
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform order to include all admin-facing fields
    const transformedOrder = {
      ...order,
      orderStatus: (order as any).orderStatus || 'draft',
      paymentStatus: (order as any).paymentStatus || 'unpaid',
      deliveryStatus: (order as any).deliveryStatus || 'pending',
      channel: (order as any).channel || 'web',
      tags: (order as any).tags ? JSON.parse((order as any).tags) : [],
      riskScore: (order as any).riskScore || 0,
      notesInternal: (order as any).notesInternal,
      notesCustomer: (order as any).notesCustomer,
      lastStatusChangeAt: (order as any).lastStatusChangeAt,
    };

    return NextResponse.json(transformedOrder, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders/[id]
 * Update order status and metadata
 *
 * Request Body:
 * {
 *   orderStatus?: "draft" | "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled"
 *   paymentStatus?: "unpaid" | "partial" | "paid" | "refunded"
 *   deliveryStatus?: "pending" | "shipped" | "delivered" | "returned"
 *   tags?: string[]
 *   notesInternal?: string
 *   notesCustomer?: string
 *   riskScore?: number (0-100)
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication and get admin info
  const session = await verifyAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin session required' },
      { status: 401 }
    );
  }

  const adminEmail = session.admin.email;

  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate statuses if provided
    const validOrderStatuses = ['draft', 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
    const validPaymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'];
    const validDeliveryStatuses = ['pending', 'shipped', 'delivered', 'returned'];

    if (body.orderStatus && !validOrderStatuses.includes(body.orderStatus)) {
      return NextResponse.json(
        { error: `Invalid orderStatus. Must be one of: ${validOrderStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.paymentStatus && !validPaymentStatuses.includes(body.paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.deliveryStatus && !validDeliveryStatuses.includes(body.deliveryStatus)) {
      return NextResponse.json(
        { error: `Invalid deliveryStatus. Must be one of: ${validDeliveryStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (body.orderStatus !== undefined) updateData.orderStatus = body.orderStatus;
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;
    if (body.deliveryStatus !== undefined) updateData.deliveryStatus = body.deliveryStatus;
    if (body.email !== undefined) updateData.email = body.email;

    // Automatic workflow: Set orderStatus to 'processing' when payment is marked as 'paid'
    if (body.paymentStatus === 'paid' && currentOrder.paymentStatus !== 'paid') {
      if (currentOrder.orderStatus === 'pending' || currentOrder.orderStatus === 'draft') {
        updateData.orderStatus = 'processing';
      }
    }

    // Automatic workflow: Set orderStatus to 'completed' when delivery is marked as 'delivered'
    if (body.deliveryStatus === 'delivered' && currentOrder.deliveryStatus !== 'delivered') {
      updateData.orderStatus = 'completed';
    }
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.deliveryMethod !== undefined) updateData.deliveryMethod = body.deliveryMethod;
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
    if (body.notesInternal !== undefined) updateData.notesInternal = body.notesInternal;
    if (body.notesCustomer !== undefined) updateData.notesCustomer = body.notesCustomer;
    if (body.riskScore !== undefined) updateData.riskScore = body.riskScore;

    // Always update lastStatusChangeAt if any status changed
    if (body.orderStatus || body.paymentStatus || body.deliveryStatus) {
      updateData.lastStatusChangeAt = new Date();
    }

    // Get current order state before update to check if paymentStatus is changing to 'paid'
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if paymentStatus is changing to 'paid' and stock hasn't been deducted yet
    const isChangingToPaid = body.paymentStatus === 'paid' && currentOrder.paymentStatus !== 'paid';
    
    // Check if paymentStatus is changing to 'refunded' and stock was already deducted
    const isChangingToRefunded = body.paymentStatus === 'refunded' && currentOrder.paymentStatus === 'paid';
    
    // Check if orderStatus is changing to 'cancelled' and stock was already deducted (order was paid)
    const isChangingToCancelled = body.orderStatus === 'cancelled' && currentOrder.orderStatus !== 'cancelled' && currentOrder.paymentStatus === 'paid';

    // Helper function to log changes to OrderHistory
    const logOrderChange = async (
      tx: any,
      orderId: string,
      field: string,
      oldValue: any,
      newValue: any,
      changeType: string,
      note?: string
    ) => {
      try {
        await tx.orderHistory.create({
          data: {
            orderId,
            changedBy: adminEmail,
            field,
            oldValue: oldValue !== null && oldValue !== undefined ? String(oldValue) : null,
            newValue: newValue !== null && newValue !== undefined ? String(newValue) : null,
            changeType,
            note,
          },
        });
      } catch (error) {
        // If OrderHistory table doesn't exist yet, just log error but don't fail
        console.error('Failed to log order change:', error);
      }
    };

    // Use transaction if we need to deduct or return stock
    const order = isChangingToPaid || isChangingToRefunded || isChangingToCancelled
      ? await prisma.$transaction(async (tx) => {
          // Log all changes before update
          if (body.orderStatus !== undefined && body.orderStatus !== currentOrder.orderStatus) {
            await logOrderChange(
              tx,
              id,
              'orderStatus',
              currentOrder.orderStatus,
              body.orderStatus,
              'status_change',
              `Status změněn z ${currentOrder.orderStatus} na ${body.orderStatus}`
            );
          }
          if (body.paymentStatus !== undefined && body.paymentStatus !== currentOrder.paymentStatus) {
            await logOrderChange(
              tx,
              id,
              'paymentStatus',
              currentOrder.paymentStatus,
              body.paymentStatus,
              'status_change',
              `Platba změněna z ${currentOrder.paymentStatus} na ${body.paymentStatus}`
            );
          }
          if (body.deliveryStatus !== undefined && body.deliveryStatus !== currentOrder.deliveryStatus) {
            await logOrderChange(
              tx,
              id,
              'deliveryStatus',
              currentOrder.deliveryStatus,
              body.deliveryStatus,
              'status_change',
              `Doručení změněno z ${currentOrder.deliveryStatus} na ${body.deliveryStatus}`
            );
          }
          if (body.email !== undefined && body.email !== currentOrder.email) {
            await logOrderChange(
              tx,
              id,
              'email',
              currentOrder.email,
              body.email,
              'field_update',
              `Email zákazníka změněn`
            );
          }
          if (body.notesInternal !== undefined && body.notesInternal !== currentOrder.notesInternal) {
            await logOrderChange(
              tx,
              id,
              'notesInternal',
              currentOrder.notesInternal,
              body.notesInternal,
              'note_added',
              `Interní poznámka ${currentOrder.notesInternal ? 'aktualizována' : 'přidána'}`
            );
          }
          if (body.notesCustomer !== undefined && body.notesCustomer !== currentOrder.notesCustomer) {
            await logOrderChange(
              tx,
              id,
              'notesCustomer',
              currentOrder.notesCustomer,
              body.notesCustomer,
              'note_added',
              `Poznámka pro zákazníka ${currentOrder.notesCustomer ? 'aktualizována' : 'přidána'}`
            );
          }

          // Log stock changes
          if (isChangingToPaid) {
            await logOrderChange(
              tx,
              id,
              'stock',
              'available',
              'deducted',
              'stock_deduction',
              `Zásoby odečteny při označení jako zaplaceno`
            );
          }
          if (isChangingToRefunded) {
            await logOrderChange(
              tx,
              id,
              'stock',
              'deducted',
              'returned',
              'stock_return',
              `Zásoby vráceny při refundu`
            );
          }
          if (isChangingToCancelled) {
            await logOrderChange(
              tx,
              id,
              'stock',
              'deducted',
              'returned',
              'stock_return',
              `Zásoby vráceny při zrušení objednávky`
            );
          }

          // Update order status
          const updatedOrder = await tx.order.update({
            where: { id },
            data: updateData,
            include: {
              items: {
                include: {
                  sku: true,
                },
              },
            },
          });

          // Deduct stock when marking as paid
          if (isChangingToPaid) {
            for (const item of updatedOrder.items) {
              if (item.sku.saleMode === 'PIECE_BY_WEIGHT') {
                // Mark as sold out (pieces are fully consumed)
                await tx.sku.update({
                  where: { id: item.skuId },
                  data: {
                    soldOut: true,
                    inStock: false,
                  },
                });

                // Record stock movement
                await tx.stockMovement.create({
                  data: {
                    skuId: item.skuId,
                    type: 'OUT',
                    grams: item.grams,
                    note: `Prodáno (objednávka ${id.substring(0, 8)}) - ruční označení`,
                    refOrderId: id,
                  },
                });
              } else if (item.sku.saleMode === 'BULK_G') {
                // Deduct grams from available stock
                const newAvailableGrams = (item.sku.availableGrams || 0) - item.grams;

                // Update SKU availability
                await tx.sku.update({
                  where: { id: item.skuId },
                  data: {
                    availableGrams: Math.max(0, newAvailableGrams),
                    inStock: newAvailableGrams > 0, // Still in stock if grams remain
                  },
                });

                // Record stock movement
                await tx.stockMovement.create({
                  data: {
                    skuId: item.skuId,
                    type: 'OUT',
                    grams: item.grams,
                    note: `Prodáno ${item.grams}g (objednávka ${id.substring(0, 8)}) - ruční označení`,
                    refOrderId: id,
                  },
                });
              }
            }
          }

          // Return stock when refunding or cancelling paid order
          if (isChangingToRefunded || isChangingToCancelled) {
            for (const item of updatedOrder.items) {
              if (item.sku.saleMode === 'PIECE_BY_WEIGHT') {
                // Return piece to stock
                await tx.sku.update({
                  where: { id: item.skuId },
                  data: {
                    soldOut: false,
                    inStock: true,
                    inStockSince: new Date(),
                  },
                });

                // Record stock movement
                await tx.stockMovement.create({
                  data: {
                    skuId: item.skuId,
                    type: 'IN',
                    grams: item.grams,
                    note: `${isChangingToRefunded ? 'Refund' : 'Zrušení'} (objednávka ${id.substring(0, 8)}) - vráceno na sklad`,
                    refOrderId: id,
                  },
                });
              } else if (item.sku.saleMode === 'BULK_G') {
                // Return grams to available stock
                const newAvailableGrams = (item.sku.availableGrams || 0) + item.grams;

                // Update SKU availability
                await tx.sku.update({
                  where: { id: item.skuId },
                  data: {
                    availableGrams: newAvailableGrams,
                    inStock: true,
                    inStockSince: newAvailableGrams > 0 ? new Date() : item.sku.inStockSince,
                  },
                });

                // Record stock movement
                await tx.stockMovement.create({
                  data: {
                    skuId: item.skuId,
                    type: 'IN',
                    grams: item.grams,
                    note: `${isChangingToRefunded ? 'Refund' : 'Zrušení'} ${item.grams}g (objednávka ${id.substring(0, 8)}) - vráceno na sklad`,
                    refOrderId: id,
                  },
                });
              }
            }
          }

          // Send payment confirmation email if marked as paid
          if (isChangingToPaid) {
            try {
              const { sendPaymentConfirmationEmail } = await import('@/lib/email');
              await sendPaymentConfirmationEmail(updatedOrder.email, id, updatedOrder.total);
            } catch (emailError) {
              console.error('Failed to send payment confirmation email:', emailError);
              // Don't fail the update if email fails
            }

            // Generate invoice automatically after successful payment
            try {
              const { generateInvoicePDF, generateInvoiceNumber } = await import('@/lib/invoice-generator');
              const { sendInvoiceEmail } = await import('@/lib/email');

              // Check if invoice already exists
              const existingInvoice = await prisma.invoice.findUnique({
                where: { orderId: id },
              });

              if (!existingInvoice) {
                // Get last invoice number
                const lastInvoice = await prisma.invoice.findFirst({
                  orderBy: { invoiceNumber: 'desc' },
                  select: { invoiceNumber: true },
                });

                const invoiceNumber = generateInvoiceNumber(lastInvoice?.invoiceNumber);

                // Calculate VAT
                const vatRate = 21.0;
                const subtotal = updatedOrder.total / (1 + vatRate / 100);
                const vatAmount = updatedOrder.total - subtotal;

                // Create invoice
                const invoice = await prisma.invoice.create({
                  data: {
                    invoiceNumber,
                    orderId: id,

                    supplierName: process.env.INVOICE_SUPPLIER_NAME || 'Mùza Hair s.r.o.',
                    supplierStreet: process.env.INVOICE_SUPPLIER_STREET,
                    supplierCity: process.env.INVOICE_SUPPLIER_CITY,
                    supplierZipCode: process.env.INVOICE_SUPPLIER_ZIP,
                    supplierCountry: 'CZ',
                    supplierIco: process.env.INVOICE_SUPPLIER_ICO,
                    supplierDic: process.env.INVOICE_SUPPLIER_DIC,
                    supplierEmail: process.env.INVOICE_SUPPLIER_EMAIL || 'info@muzahair.cz',
                    supplierPhone: process.env.INVOICE_SUPPLIER_PHONE || '+420 728 722 880',

                    customerName: (updatedOrder as any).companyName || `${updatedOrder.firstName} ${updatedOrder.lastName}`,
                    customerEmail: updatedOrder.email,
                    customerPhone: updatedOrder.phone,
                    customerStreet: (updatedOrder as any).billingStreet || updatedOrder.streetAddress,
                    customerCity: (updatedOrder as any).billingCity || updatedOrder.city,
                    customerZipCode: (updatedOrder as any).billingZipCode || updatedOrder.zipCode,
                    customerCountry: (updatedOrder as any).billingCountry || updatedOrder.country,
                    customerIco: (updatedOrder as any).ico,
                    customerDic: (updatedOrder as any).dic,

                    subtotal,
                    vatRate,
                    vatAmount,
                    total: updatedOrder.total,

                    paymentMethod: (updatedOrder as any).paymentMethod || 'manual',
                    variableSymbol: invoiceNumber,
                    bankAccount: process.env.INVOICE_BANK_ACCOUNT,
                    iban: process.env.INVOICE_IBAN,
                    swift: process.env.INVOICE_SWIFT,

                    issueDate: new Date(),
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    taxDate: new Date(),
                    paidDate: new Date(),

                    status: 'paid',
                  },
                });

                // Generate PDF
                const invoiceData = {
                  invoiceNumber: invoice.invoiceNumber,
                  issueDate: invoice.issueDate,
                  dueDate: invoice.dueDate,
                  taxDate: invoice.taxDate,
                  orderId: invoice.orderId,
                  supplierName: invoice.supplierName,
                  supplierStreet: invoice.supplierStreet,
                  supplierCity: invoice.supplierCity,
                  supplierZipCode: invoice.supplierZipCode,
                  supplierCountry: invoice.supplierCountry,
                  supplierIco: invoice.supplierIco,
                  supplierDic: invoice.supplierDic,
                  supplierEmail: invoice.supplierEmail,
                  supplierPhone: invoice.supplierPhone,
                  customerName: invoice.customerName,
                  customerEmail: invoice.customerEmail,
                  customerPhone: invoice.customerPhone,
                  customerStreet: invoice.customerStreet,
                  customerCity: invoice.customerCity,
                  customerZipCode: invoice.customerZipCode,
                  customerCountry: invoice.customerCountry,
                  customerIco: invoice.customerIco,
                  customerDic: invoice.customerDic,
                  items: updatedOrder.items.map((item) => ({
                    name: item.nameSnapshot || 'Neznámý produkt',
                    quantity: item.saleMode === 'BULK_G' ? `${item.grams}g` : '1',
                    unitPrice: item.pricePerGram,
                    total: item.lineTotal + (item.assemblyFeeTotal || 0),
                  })),
                  subtotal: invoice.subtotal,
                  vatRate: invoice.vatRate,
                  vatAmount: invoice.vatAmount,
                  total: invoice.total,
                  paymentMethod: invoice.paymentMethod,
                  variableSymbol: invoice.variableSymbol,
                  bankAccount: invoice.bankAccount,
                  iban: invoice.iban,
                  swift: invoice.swift,
                };

                const pdfBase64 = generateInvoicePDF(invoiceData);

                // Update invoice with PDF status
                await prisma.invoice.update({
                  where: { id: invoice.id },
                  data: { pdfGenerated: true },
                });

                // Send invoice email (async, don't wait)
                sendInvoiceEmail(updatedOrder.email, invoiceNumber, pdfBase64).catch((err) => {
                  console.error('Failed to send invoice email:', err);
                });

                console.log(`📄 Invoice ${invoiceNumber} generated and sent for order ${id}`);
              } else {
                console.log(`📄 Invoice already exists for order ${id}`);
              }
            } catch (invoiceError) {
              console.error('Failed to generate invoice (non-critical):', invoiceError);
              // Don't fail the update if invoice generation fails
            }
          }

          // Send delivery confirmation email if marked as delivered
          const isChangingToDelivered = body.deliveryStatus === 'delivered' && currentOrder.deliveryStatus !== 'delivered';
          const isChangingToCompleted = body.orderStatus === 'completed' && currentOrder.orderStatus !== 'completed';
          if (isChangingToDelivered || isChangingToCompleted) {
            try {
              const { sendDeliveryConfirmationEmail } = await import('@/lib/email');
              await sendDeliveryConfirmationEmail(updatedOrder.email, id);
            } catch (emailError) {
              console.error('Failed to send delivery confirmation email:', emailError);
              // Don't fail the update if email fails
            }
          }

          // Send cancellation email if order is cancelled or refunded
          if (isChangingToCancelled || isChangingToRefunded) {
            try {
              const { sendOrderCancellationEmail } = await import('@/lib/email');
              const reason = isChangingToRefunded ? 'Vrácení platby' : 'Zrušení objednávky';
              await sendOrderCancellationEmail(updatedOrder.email, id, reason);
            } catch (emailError) {
              console.error('Failed to send cancellation email:', emailError);
              // Don't fail the update if email fails
            }
          }

          return updatedOrder;
        })
      : await (async () => {
          // Log changes before update (non-transaction case)
          const historyPromises = [];
          
          if (body.orderStatus !== undefined && body.orderStatus !== currentOrder.orderStatus) {
            historyPromises.push(
              logOrderChange(
                prisma,
                id,
                'orderStatus',
                currentOrder.orderStatus,
                body.orderStatus,
                'status_change',
                `Status změněn z ${currentOrder.orderStatus} na ${body.orderStatus}`
              )
            );
          }
          if (body.paymentStatus !== undefined && body.paymentStatus !== currentOrder.paymentStatus) {
            historyPromises.push(
              logOrderChange(
                prisma,
                id,
                'paymentStatus',
                currentOrder.paymentStatus,
                body.paymentStatus,
                'status_change',
                `Platba změněna z ${currentOrder.paymentStatus} na ${body.paymentStatus}`
              )
            );
          }
          if (body.deliveryStatus !== undefined && body.deliveryStatus !== currentOrder.deliveryStatus) {
            historyPromises.push(
              logOrderChange(
                prisma,
                id,
                'deliveryStatus',
                currentOrder.deliveryStatus,
                body.deliveryStatus,
                'status_change',
                `Doručení změněno z ${currentOrder.deliveryStatus} na ${body.deliveryStatus}`
              )
            );
          }
          if (body.email !== undefined && body.email !== currentOrder.email) {
            historyPromises.push(
              logOrderChange(
                prisma,
                id,
                'email',
                currentOrder.email,
                body.email,
                'field_update',
                `Email zákazníka změněn`
              )
            );
          }
          if (body.notesInternal !== undefined && body.notesInternal !== currentOrder.notesInternal) {
            historyPromises.push(
              logOrderChange(
                prisma,
                id,
                'notesInternal',
                currentOrder.notesInternal,
                body.notesInternal,
                'note_added',
                `Interní poznámka ${currentOrder.notesInternal ? 'aktualizována' : 'přidána'}`
              )
            );
          }
          if (body.notesCustomer !== undefined && body.notesCustomer !== currentOrder.notesCustomer) {
            historyPromises.push(
              logOrderChange(
                prisma,
                id,
                'notesCustomer',
                currentOrder.notesCustomer,
                body.notesCustomer,
                'note_added',
                `Poznámka pro zákazníka ${currentOrder.notesCustomer ? 'aktualizována' : 'přidána'}`
              )
            );
          }

          // Log all changes in parallel (don't fail if history table doesn't exist)
          await Promise.allSettled(historyPromises);

          // Update order
          return await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
              items: {
                include: {
                  sku: {
                    select: {
                      id: true,
                      sku: true,
                      name: true,
                      shadeName: true,
                      lengthCm: true,
                    },
                  },
                },
              },
            },
          });
        })();

    // Handle email notifications outside transaction for non-stock-changing updates
    if (!isChangingToPaid && !isChangingToRefunded && !isChangingToCancelled) {
      // Check for delivery status change
      const isChangingToDelivered = body.deliveryStatus === 'delivered' && currentOrder.deliveryStatus !== 'delivered';
      const isChangingToCompleted = body.orderStatus === 'completed' && currentOrder.orderStatus !== 'completed';
      if (isChangingToDelivered || isChangingToCompleted) {
        try {
          const { sendDeliveryConfirmationEmail } = await import('@/lib/email');
          await sendDeliveryConfirmationEmail(order.email, id);
        } catch (emailError) {
          console.error('Failed to send delivery confirmation email:', emailError);
        }
      }

      // Check for cancellation
      const isChangingToCancelledOutside = body.orderStatus === 'cancelled' && currentOrder.orderStatus !== 'cancelled';
      const isChangingToRefundedOutside = body.paymentStatus === 'refunded' && currentOrder.paymentStatus !== 'refunded';
      if (isChangingToCancelledOutside || isChangingToRefundedOutside) {
        try {
          const { sendOrderCancellationEmail } = await import('@/lib/email');
          const reason = isChangingToRefundedOutside ? 'Vrácení platby' : 'Zrušení objednávky';
          await sendOrderCancellationEmail(order.email, id, reason);
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
        }
      }
    }

    // Transform order to include all admin-facing fields
    const transformedOrder = {
      ...order,
      orderStatus: (order as any).orderStatus || 'draft',
      paymentStatus: (order as any).paymentStatus || 'unpaid',
      deliveryStatus: (order as any).deliveryStatus || 'pending',
      channel: (order as any).channel || 'web',
      tags: (order as any).tags ? JSON.parse((order as any).tags) : [],
      riskScore: (order as any).riskScore || 0,
      notesInternal: (order as any).notesInternal,
      notesCustomer: (order as any).notesCustomer,
      lastStatusChangeAt: (order as any).lastStatusChangeAt,
    };

    return NextResponse.json(transformedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
