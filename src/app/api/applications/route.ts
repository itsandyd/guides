import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await getAuthSession();

    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new NextResponse('Missing userId parameter', { status: 400 });
    }

    try {
        const applications = await db.application.findMany({
            where: {
                applicantId: userId
            },
            include: {
                team: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return new NextResponse('Error fetching applications', { status: 500 });
    }
}