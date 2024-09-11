import { redirect } from 'next/navigation'
import { UserNameForm } from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import { UserProfileForm } from '@/components/UserProfileForm'
import { db } from '@/lib/db'

export const metadata = {
  title: 'Profile Settings',
  description: 'Manage your profile and account settings.',
}

export default async function SettingsPage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || '/login')
  }

  // Fetch the full user data from the database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return (
    <div className='max-w-4xl mx-auto py-12'>
      <div className='grid items-start gap-8'>
        <h1 className='font-bold text-3xl md:text-4xl'>Profile Settings</h1>

        <div className='grid gap-10'>
          <UserNameForm
            user={{
              id: user.id,
              username: user.username || '',
            }}
          />

          <UserProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}
