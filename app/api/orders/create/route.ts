import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  deliveryMethod: string;
  items: Array<{
    skuId: string;
    skuName: string;
    quantity: number;
    lineTotal: number;
    lineGrandTotal: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validace vstupních dat
    if (!body.email?.trim()) {
      return NextResponse.json(
        { message: 'Email je povinný' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { message: 'Objednávka musí obsahovat alespoň jednu položku' },
        { status: 400 }
      );
    }

    // Výpočet součtů
    const subtotal = body.items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    const total = body.items.reduce((sum, item) => sum + (item.lineGrandTotal || 0), 0);

    // Vytvoření objednávky - používáme jen pole, která jsou v aktuální databázi
    const order = await prisma.order.create({
      data: {
        email: body.email.trim(),
        status: 'awaiting_payment',
        total: total / 100, // Konverze z haléřů na koruny
      },
    });

    return NextResponse.json(
      {
        id: order.id,
        orderId: order.id,
        email: order.email,
        total: total / 100, // Vrátíme vypočítaný total z požadavku
        status: order.status,
        message: 'Objednávka byla úspěšně vytvořena. Čekáme na vaši platbu.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Chyba při vytvoření objednávky:', error);
    return NextResponse.json(
      { message: 'Chyba při vytvoření objednávky. Zkuste to prosím znovu.' },
      { status: 500 }
    );
  }
}
