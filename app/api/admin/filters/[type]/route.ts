import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function GET(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from(params.type)
            .select('*')
            .order('name');

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching filters:', error);
        return NextResponse.json(
            { error: 'Failed to fetch filters' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const supabase = createClient();
        const { name } = await request.json();

        const { data, error } = await supabase
            .from(params.type)
            .insert([{ id: nanoid(), name }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating filter:', error);
        return NextResponse.json(
            { error: 'Failed to create filter' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const supabase = createClient();
        const { id, name } = await request.json();

        const { data, error } = await supabase
            .from(params.type)
            .update({ name })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating filter:', error);
        return NextResponse.json(
            { error: 'Failed to update filter' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const supabase = createClient();
        const { id } = await request.json();

        const { error } = await supabase
            .from(params.type)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting filter:', error);
        return NextResponse.json(
            { error: 'Failed to delete filter' },
            { status: 500 }
        );
    }
}
