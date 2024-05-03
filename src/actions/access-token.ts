'use server'

import { db } from '@/lib/db'

export default async function getAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId: userId
    }
  });

  if (!account) {
    throw new Error('Account not found');
  }

  return account.access_token;
}