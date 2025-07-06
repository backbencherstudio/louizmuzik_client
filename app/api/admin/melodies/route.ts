import { NextResponse } from 'next/server';

// Mock data for development
const mockMelodies = Array.from({ length: 50 }, (_, i) => ({
    id: `melody-${i + 1}`,
    title: `Test Melody ${i + 1}`,
    producer: {
        username: `producer${i + 1}`,
        email: `producer${i + 1}@example.com`,
    },
    bpm: Math.floor(Math.random() * (180 - 70) + 70),
    key:
        ['C', 'G', 'D', 'A', 'E', 'B', 'F#'][Math.floor(Math.random() * 7)] +
        ['major', 'minor'][Math.floor(Math.random() * 2)],
    genre: ['Trap', 'Hip Hop', 'R&B', 'Pop', 'Reggaeton'][
        Math.floor(Math.random() * 5)
    ],
    instrument: ['Piano', 'Guitar', 'Synth', 'Strings', 'Brass'][
        Math.floor(Math.random() * 5)
    ],
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
    stats: {
        downloads: Math.floor(Math.random() * 1000),
        plays: Math.floor(Math.random() * 5000),
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

    // Filter melodies based on search and status
    let filteredMelodies = [...mockMelodies];

    if (search) {
        const searchLower = search.toLowerCase();
        filteredMelodies = filteredMelodies.filter(
            (melody) =>
                melody.title.toLowerCase().includes(searchLower) ||
                melody.producer.username.toLowerCase().includes(searchLower) ||
                melody.producer.email.toLowerCase().includes(searchLower)
        );
    }

    if (status) {
        filteredMelodies = filteredMelodies.filter(
            (melody) => melody.status === status
        );
    }

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedMelodies = filteredMelodies.slice(start, end);

    return NextResponse.json({
        melodies: paginatedMelodies,
        pagination: {
            total: filteredMelodies.length,
            page,
            limit,
        },
    });
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const { melodyId, action } = body;

    // In a real application, you would update the database here
    // For now, we'll just return a success response
    return NextResponse.json({
        success: true,
        message: `Melody ${melodyId} ${action}ed successfully`,
    });
}
