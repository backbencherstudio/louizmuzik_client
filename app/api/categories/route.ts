import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// TODO: Import MongoDB client and configure connection

// GET - Obtener todas las categorías
export async function GET(request: Request) {
    try {
        // TODO: Implement MongoDB query to fetch categories
        const categories = [];

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST - Crear una nueva categoría (solo admin)
export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        // TODO: Implement authentication check with MongoDB/JWT

        const { name, description } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // TODO: Implement MongoDB query to create new category
        const newCategory = { name, description };

        return NextResponse.json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
