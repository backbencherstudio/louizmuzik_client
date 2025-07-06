import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const producerId = searchParams.get('producerId');

        if (!producerId) {
            return NextResponse.json(
                { error: 'Producer ID is required' },
                { status: 400 }
            );
        }

        // Obtener el conteo de seguidores
        const { count: followersCount, error: followersError } = await supabase
            .from('producer_follows')
            .select('*', { count: 'exact', head: true })
            .eq('producer_id', producerId);

        if (followersError) {
            return NextResponse.json(
                { error: followersError.message },
                { status: 400 }
            );
        }

        // Obtener el conteo de seguidos
        const { count: followingCount, error: followingError } = await supabase
            .from('producer_follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', producerId);

        if (followingError) {
            return NextResponse.json(
                { error: followingError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            followers: followersCount || 0,
            following: followingCount || 0,
        });
    } catch (error) {
        console.error('Error fetching follow counts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
