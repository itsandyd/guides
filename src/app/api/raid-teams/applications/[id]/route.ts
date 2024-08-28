import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getAuthSession();

    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const applicationId = params.id;

    if (!applicationId) {
        return new NextResponse('Missing application id', { status: 400 });
    }

    try {
        const application = await db.application.findUnique({
            where: { id: applicationId },
        });

        if (!application) {
            return new NextResponse('Application not found', { status: 404 });
        }

        if (application.applicantId !== session.user.id) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        await db.application.delete({
            where: { id: applicationId },
        });

        return new NextResponse(JSON.stringify({ message: 'Application deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting application:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getAuthSession();

    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const applicationId = params.id;
    const { status } = await req.json();

    if (!['APPROVED', 'DECLINED', 'PENDING'].includes(status)) {
        return new NextResponse('Invalid status', { status: 400 });
    }

    try {
        const application = await db.application.findUnique({
            where: { id: applicationId },
            include: { team: true },
        });

        if (!application) {
            return new NextResponse('Application not found', { status: 404 });
        }

        if (application.team.creatorId !== session.user.id) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const updatedApplication = await db.application.update({
            where: { id: applicationId },
            data: { status },
        });

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}