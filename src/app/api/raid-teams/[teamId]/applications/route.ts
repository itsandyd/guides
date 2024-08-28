import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const teamId = params.teamId;

    const team = await db.raidTeam.findUnique({
      where: { id: teamId },
    });

    if (!team || team.creatorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const applications = await db.application.findMany({
      where: { teamId: teamId },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}