import { Icons } from '@/components/Icons'
import UserAuthForm from '@/components/UserAuthForm'
import { Book } from 'lucide-react'
import Link from 'next/link'

const SignUp = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Book className='mx-auto h-8 w-8 text-primary' />
        <h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
        <p className='text-sm max-w-xs mx-auto text-muted-foreground'>
          By continuing, you are setting up a GuidesForGamers account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        Already a member of GuidesForGamers?{' '}
        <Link
          href='/sign-in'
          className='hover:text-primary text-sm underline underline-offset-4'>
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignUp
