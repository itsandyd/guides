import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const teams = await db.raidTeam.findMany();
  return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { name, about, schedule, roles, progress, requirements, classesAndSpecs, leaderName, contactInfo } = await req.json();
  const newTeam = await db.raidTeam.create({
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
      creatorId: session.user.id
    },
  });
  return NextResponse.json(newTeam, { status: 201 });
}