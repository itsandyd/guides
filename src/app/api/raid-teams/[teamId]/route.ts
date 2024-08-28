import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { teamId: string } }) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { teamId } = params;
  const { name, about, schedule, roles, progress, requirements, classesAndSpecs, leaderName, contactInfo } = await req.json();

  const team = await db.raidTeam.findUnique({ where: { id: teamId } });

  if (!team || team.creatorId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const updatedTeam = await db.raidTeam.update({
    where: { id: teamId },
    data: { 
      name, 
      about,
      schedule, 
      roles, 
      progress, 
      requirements, 
      classesAndSpecs: classesAndSpecs || {},
      leaderName,
      contactInfo,
    },
  });
  return NextResponse.json(updatedTeam);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { teamId: string } }
) {
    const session = await getAuthSession();

    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { teamId } = params;

    try {
        const team = await db.raidTeam.findUnique({
            where: { id: teamId },
            include: { applications: true },
        });

        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        if (team.creatorId !== session.user.id) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        // Delete all associated applications first
        await db.application.deleteMany({
            where: { teamId: teamId },
        });

        // Now delete the raid team
        await db.raidTeam.delete({
            where: { id: teamId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}