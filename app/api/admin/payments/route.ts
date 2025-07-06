import { NextResponse } from 'next/server';

// Mock data for development
const mockPayments = Array.from({ length: 50 }, (_, i) => {
    const isSubscription = Math.random() > 0.5;
    const amount = isSubscription
        ? 9.99
        : Math.floor(Math.random() * (100 - 10) + 10) + 0.99;
    const commission = !isSubscription
        ? Number((amount * 0.03).toFixed(2))
        : undefined;

    return {
        id: `payment-${i + 1}`,
        type: isSubscription ? 'subscription' : 'marketplace',
        amount,
        commission,
        status: ['completed', 'pending', 'failed', 'refunded'][
            Math.floor(Math.random() * 4)
        ],
        method: ['stripe', 'paypal'][Math.floor(Math.random() * 2)],
        user: {
            id: `user-${Math.floor(Math.random() * 100) + 1}`,
            name: `User ${Math.floor(Math.random() * 100) + 1}`,
            email: `user${Math.floor(Math.random() * 100) + 1}@example.com`,
        },
        details: isSubscription
            ? {
                  subscriptionId: `sub-${Math.floor(Math.random() * 1000) + 1}`,
              }
            : {
                  productId: `product-${Math.floor(Math.random() * 1000) + 1}`,
                  productTitle: `Sample Pack ${
                      Math.floor(Math.random() * 100) + 1
                  }`,
                  seller: {
                      id: `seller-${Math.floor(Math.random() * 100) + 1}`,
                      name: `Seller ${Math.floor(Math.random() * 100) + 1}`,
                      email: `seller${
                          Math.floor(Math.random() * 100) + 1
                      }@example.com`,
                  },
              },
        created_at: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
        ).toISOString(),
    };
});

// GET - Obtener lista de pagos y comisiones (solo admin)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const method = searchParams.get('method') || '';

    // Filter payments based on search and filters
    let filteredPayments = [...mockPayments];

    if (search) {
        const searchLower = search.toLowerCase();
        filteredPayments = filteredPayments.filter(
            (payment) =>
                payment.user.name.toLowerCase().includes(searchLower) ||
                payment.user.email.toLowerCase().includes(searchLower) ||
                (payment.type === 'marketplace' &&
                    payment.details.productTitle
                        ?.toLowerCase()
                        .includes(searchLower))
        );
    }

    if (type) {
        filteredPayments = filteredPayments.filter(
            (payment) => payment.type === type
        );
        }

    if (status) {
        filteredPayments = filteredPayments.filter(
            (payment) => payment.status === status
        );
        }

    if (method) {
        filteredPayments = filteredPayments.filter(
            (payment) => payment.method === method
        );
        }

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPayments = filteredPayments.slice(start, end);

        return NextResponse.json({
        payments: paginatedPayments,
            pagination: {
            total: filteredPayments.length,
                page,
                limit,
            },
        });
}

export async function PATCH(request: Request) {
        const body = await request.json();
    const { paymentId, action } = body;

    // In a real application, you would:
    // 1. For cancel: Call Stripe/PayPal API to cancel the subscription
    // 2. For refund: Process the refund through the payment provider
    // 3. Update the payment status in the database

        return NextResponse.json({
        success: true,
        message: `Payment ${paymentId} ${action}ed successfully`,
        });
}
