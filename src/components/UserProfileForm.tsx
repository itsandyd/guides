'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/hooks/use-toast'
import { User } from '@prisma/client'

const profileFormSchema = z.object({
  bio: z.string().max(160).optional(),
  location: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function UserProfileForm({ user }: { user: User }) {
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your profile was not updated. Please try again.',
        variant: 'destructive',
      })
    }

    toast({
      description: 'Your profile has been updated.',
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Textarea
        {...form.register('bio')}
        placeholder="Tell us about yourself"
        className="resize-none min-h-[100px] h-24"
      />
      <Input {...form.register('location')} placeholder="Location" />
      <Input {...form.register('website')} placeholder="Website" type="url" />
      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}