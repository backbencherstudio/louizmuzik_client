import { NextResponse } from 'next/server';

export async function GET() {
    // Datos mock simplificados para las estadísticas globales
    const mockStats = {
        activeUsers: Math.floor(Math.random() * 5000) + 1000,
        proUsers: Math.floor(Math.random() * 1000) + 100,
        totalMelodies: Math.floor(Math.random() * 10000) + 2000,
        totalDownloads: Math.floor(Math.random() * 50000) + 5000,
        totalSamplePacks: Math.floor(Math.random() * 2000) + 500,
        totalRevenue: Math.floor(Math.random() * 100000) + 10000,
    };

    return NextResponse.json(mockStats);
}
 