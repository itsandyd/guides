import { Icons } from '@/components/Icons'
import UserAuthForm from '@/components/UserAuthForm'
import { Book } from 'lucide-react'
import Link from 'next/link'

const SignIn = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Book className='mx-auto h-8 w-8 text-primary' />
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm max-w-xs mx-auto text-muted-foreground'>
          By continuing, you are signing in to your GuidesForGamers account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        New to GuidesForGamers?{' '}
        <Link
          href='/sign-up'
          className='hover:text-primary text-sm underline underline-offset-4'>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default SignIn
