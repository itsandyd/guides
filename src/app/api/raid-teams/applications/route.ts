import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

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
						id: true,
						name: true,
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

export async function POST(req: NextRequest) {
	const session = await getAuthSession();

	if (!session?.user) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	try {
		const { teamId, characterName, characterClass, characterSpec, experience, availability, additionalInfo } = await req.json();

		const newApplication = await db.application.create({
			data: {
				applicantId: session.user.id,
				teamId,
				characterName,
				characterClass,
				characterSpec,
				experience,
				availability,
				additionalInfo,
			},
		});

		return NextResponse.json(newApplication, { status: 201 });
	} catch (error) {
		console.error('Error creating application:', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}