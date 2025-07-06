import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Mock data for testing
const mockUsers = [
    {
        id: '1',
        email: 'john.doe@example.com',
        username: 'John Doe',
        role: 'admin',
        is_blocked: false,
        created_at: '2024-01-15T10:00:00Z',
        subscription: {
            status: 'active',
            current_period_end: '2024-12-31T23:59:59Z',
        },
    },
    {
        id: '2',
        email: 'jane.smith@example.com',
        username: 'Jane Smith',
        role: 'pro',
        is_blocked: false,
        created_at: '2024-01-20T15:30:00Z',
        subscription: {
            status: 'active',
            current_period_end: '2024-06-30T23:59:59Z',
        },
    },
    {
        id: '3',
        email: 'bob.wilson@example.com',
        username: 'Bob Wilson',
        role: 'free',
        is_blocked: false,
        created_at: '2024-02-01T09:15:00Z',
        subscription: null,
    },
    {
        id: '4',
        email: 'alice.johnson@example.com',
        username: 'Alice Johnson',
        role: 'pro',
        is_blocked: true,
        created_at: '2024-01-25T11:45:00Z',
        subscription: {
            status: 'cancelled',
            current_period_end: '2024-03-31T23:59:59Z',
        },
    },
    {
        id: '5',
        email: 'mike.brown@example.com',
        username: 'Mike Brown',
        role: 'free',
        is_blocked: false,
        created_at: '2024-02-05T14:20:00Z',
        subscription: null,
    },
    {
        id: '6',
        email: 'sarah.davis@example.com',
        username: 'Sarah Davis',
        role: 'pro',
        is_blocked: false,
        created_at: '2024-01-18T16:10:00Z',
        subscription: {
            status: 'trialing',
            current_period_end: '2024-03-15T23:59:59Z',
        },
    },
    {
        id: '7',
        email: 'david.miller@example.com',
        username: 'David Miller',
        role: 'free',
        is_blocked: true,
        created_at: '2024-02-03T13:25:00Z',
        subscription: null,
    },
    {
        id: '8',
        email: 'emma.wilson@example.com',
        username: 'Emma Wilson',
        role: 'pro',
        is_blocked: false,
        created_at: '2024-01-22T10:30:00Z',
        subscription: {
            status: 'active',
            current_period_end: '2024-09-30T23:59:59Z',
        },
    },
    {
        id: '9',
        email: 'chris.taylor@example.com',
        username: 'Chris Taylor',
        role: 'free',
        is_blocked: false,
        created_at: '2024-02-07T09:00:00Z',
        subscription: null,
    },
    {
        id: '10',
        email: 'lisa.anderson@example.com',
        username: 'Lisa Anderson',
        role: 'pro',
        is_blocked: false,
        created_at: '2024-01-28T12:40:00Z',
        subscription: {
            status: 'expired',
            current_period_end: '2024-02-28T23:59:59Z',
        },
    },
];

// GET - Obtener lista de usuarios con filtros
export async function GET(request: Request) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role');
        const status = searchParams.get('status');

        // Filter users based on search term
        let filteredUsers = [...mockUsers];

        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
            );
        }

        // Filter by role
        if (role) {
            filteredUsers = filteredUsers.filter((user) => user.role === role);
        }

        // Filter by status
        if (status) {
            filteredUsers = filteredUsers.filter(
                (user) => user.is_blocked === (status === 'blocked')
            );
        }

        // Calculate pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedUsers = filteredUsers.slice(start, end);

        return NextResponse.json({
            users: paginatedUsers,
            pagination: {
                page,
                limit,
                total: filteredUsers.length,
                totalPages: Math.ceil(filteredUsers.length / limit),
            },
        });
    } catch (error) {
        console.error('Error in mock users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar usuario (bloquear/desbloquear, cambiar rol)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { userId, action, role } = body;

        // Find user in mock data
        const userIndex = mockUsers.findIndex((user) => user.id === userId);

        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update user based on action
        if (action === 'block') {
            mockUsers[userIndex].is_blocked = true;
        } else if (action === 'unblock') {
            mockUsers[userIndex].is_blocked = false;
        }

        // Update role if provided
        if (role && ['admin', 'pro', 'free'].includes(role)) {
            mockUsers[userIndex].role = role;
        }

        return NextResponse.json({
            message: 'User updated successfully',
            user: mockUsers[userIndex],
        });
    } catch (error) {
        console.error('Error in mock user update:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
