import { NextResponse } from 'next/server';

// Mock data for development
const mockSamplePacks = Array.from({ length: 50 }, (_, i) => ({
    id: `pack-${i + 1}`,
    title: `Sample Pack ${i + 1}`,
    producer: {
        username: `producer${i + 1}`,
        email: `producer${i + 1}@example.com`,
    },
    price: Math.floor(Math.random() * (100 - 10) + 10) + 0.99,
    description: `This is a sample pack containing various ${
        ['Trap', 'Hip Hop', 'R&B', 'Pop', 'Reggaeton'][
            Math.floor(Math.random() * 5)
        ]
    } sounds and loops.`,
    coverArt:
        Math.random() > 0.3 ? `https://picsum.photos/200/200?random=${i}` : '',
    demoAudio: `https://example.com/demo-${i + 1}.mp3`,
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
    stats: {
        sales: Math.floor(Math.random() * 500),
        revenue: Math.floor(Math.random() * 5000),
    },
    created_at: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
}));

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Filter sample packs based on search and status
    let filteredPacks = [...mockSamplePacks];

    if (search) {
        const searchLower = search.toLowerCase();
        filteredPacks = filteredPacks.filter(
            (pack) =>
                pack.title.toLowerCase().includes(searchLower) ||
                pack.producer.username.toLowerCase().includes(searchLower) ||
                pack.producer.email.toLowerCase().includes(searchLower) ||
                pack.description.toLowerCase().includes(searchLower)
        );
    }

    if (status) {
        filteredPacks = filteredPacks.filter((pack) => pack.status === status);
    }

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPacks = filteredPacks.slice(start, end);

    return NextResponse.json({
        packs: paginatedPacks,
        pagination: {
            total: filteredPacks.length,
            page,
            limit,
        },
    });
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const { packId, action } = body;

    // In a real application, you would update the database here
    // For now, we'll just return a success response
    return NextResponse.json({
        success: true,
        message: `Sample pack ${packId} ${action}ed successfully`,
    });
}
