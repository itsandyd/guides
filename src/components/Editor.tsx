'use client'

import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { z } from 'zod'

import { toast } from '@/hooks/use-toast'
import { uploadFiles } from '@/lib/uploadthing'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { generateSlug } from '@/lib/utils'

import '@/styles/editor.css'

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/Command'
import { Button } from '@/components/ui/Button'
import { useUser } from '@clerk/nextjs'

type FormData = z.infer<typeof PostValidator>

interface EditorProps {
  subredditId: string
  tags: { id: string; name: string }[]
  postId?: string
  initialData?: any
  guideSlug: string
}

export const Editor: React.FC<EditorProps> = ({ subredditId, tags, postId, initialData, guideSlug }) => {
  const { user } = useUser()
  const params = useParams()
  const isEditing = !!postId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
      selectedTags: [],
      slug: '', // This is now valid
    },
  });

  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>(tags);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const pathname = usePathname()

  const { data: existingPost } = useQuery(
    ['post', postId],
    () => axios.get(`/api/subreddit/post/${postId}`).then((res) => res.data),
    {
      enabled: isEditing,
      onSuccess: (data) => {
        if (data) {
          setValue('title', data.title);
          setValue('content', data.content);
          setSelectedTags(data.tags);
        }
      },
    }
  );

  const { mutate: upsertPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
      selectedTags,
    }: PostCreationRequest) => {
      const slug = generateSlug(title)
      const payload: PostCreationRequest = { title, content, subredditId, selectedTags, slug } // This is now valid
      if (postId) {
        return axios.put(`/api/subreddit/post/${postId}`, payload)
      } else {
        return axios.post('/api/subreddit/post/create', payload)
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || `An error occurred while ${isEditing ? 'updating' : 'creating'} the post.`
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        })
      }
    },
    onSuccess: () => {
      router.push(`/guides/${guideSlug}`)
      router.refresh()
      return toast({
        description: `Your post has been ${isEditing ? 'updated' : 'published'}.`,
      })
    },
  });

  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null)
  const [editorReady, setEditorReady] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const initializeEditor = useCallback(async () => {
    if (editorInstance || !isMounted || !editorRef.current) return

    try {
      const EditorJS = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const Embed = (await import('@editorjs/embed')).default
      const Table = (await import('@editorjs/table')).default
      const List = (await import('@editorjs/list')).default
      const Code = (await import('@editorjs/code')).default
      const LinkTool = (await import('@editorjs/link')).default
      const InlineCode = (await import('@editorjs/inline-code')).default
      const ImageTool = (await import('@editorjs/image')).default

      const editor = new EditorJS({
        holder: editorRef.current,
        onReady: () => {
          setEditorReady(true)
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: initialData?.content || { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader')
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })

      editor.isReady.then(() => {
        setEditorInstance(editor)
      }).catch((error) => {
        console.error('Editor initialization failed:', error)
      })

    } catch (error) {
      console.error('Failed to initialize the editor:', error)
    }
  }, [isMounted, editorInstance, initialData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (isMounted && !editorInstance && editorRef.current) {
      initializeEditor()
    }

    return () => {
      if (editorInstance) {
        if (editorInstance.isReady) {
          editorInstance.isReady.then(() => {
            editorInstance.destroy();
            setEditorInstance(null);
            setEditorReady(false);
          });
        } else {
          console.warn('Editor was not ready before unmounting');
        }
      }
    }
  }, [isMounted, initializeEditor, editorInstance])

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      if (editorInstance) {
        editorInstance.render(initialData.content);
      }
      setSelectedTags(initialData.tags);
    }
  }, [initialData, setValue, editorInstance]);

  const handleTagSelect = (tagId: string) => {
    const tag = availableTags.find((t: { id: string }) => t.id === tagId);
    if (tag && !selectedTags.some((t: { id: string }) => t.id === tagId)) {
      setSelectedTags(prevSelectedTags => [...prevSelectedTags, tag]);
      setValue('selectedTags', [...selectedTags, tag].map((t: { id: string }) => t.id));
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    setValue('selectedTags', selectedTags.filter(tag => tag.id !== tagId).map(t => t.id));
  };

  const handleCreateNewTag = async () => {
    if (newTagName) {
      setIsLoading(true)
      try {
        const response = await axios.post('/api/tags', { name: newTagName, subredditId })
        const newTag = response.data
        setAvailableTags(prevTags => [...prevTags, newTag])
        setSelectedTags(prevSelectedTags => [...prevSelectedTags, newTag])
        setValue('selectedTags', [...selectedTags, newTag].map(t => t.id))
        setNewTagName('')
        toast({
          title: 'Tag created',
          description: `New tag "${newTag.name}" has been created and selected.`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to create new tag. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
  };

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
      selectedTags: data.selectedTags,
      slug: generateSlug(data.title), // This is now valid
    }

    upsertPost(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register('title')

  return (
    <div className='w-full p-4 bg-background rounded-lg border border-border'>
      {isMounted && (
        <form
          id='subreddit-post-form'
          className='w-fit'
          onSubmit={handleSubmit(onSubmit)}>
          <div className='prose prose-stone dark:prose-invert'>
            <TextareaAutosize
              ref={(e) => {
                titleRef(e)
                // @ts-ignore
                _titleRef.current = e
              }}
              {...rest}
              placeholder='Title'
              className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none text-foreground'
            />
            <div ref={editorRef} className='min-h-[500px]'>
              {!editorReady && (
                <div className='flex items-center justify-center h-full'>
                  Loading editor...
                </div>
              )}
            </div>
            
            <Command className="border rounded-md mt-4">
              <CommandInput placeholder="Search tags..." isLoading={isLoading} />
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {availableTags.map((tag: { id: string; name: string }) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map(tag => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleTagRemove(tag.id)}
                  />
                </Badge>
              ))}
            </div>

            <div>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag name"
              />
              <Button onClick={handleCreateNewTag} disabled={isLoading}>
                Create New Tag
              </Button>
            </div>

            <p className='text-sm text-muted-foreground'>
              Use{' '}
              <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
                Tab
              </kbd>{' '}
              to open the command menu.
            </p>
          </div>

          <Button type="submit" className="mt-4">
            {isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </form>
      )}
    </div>
  )
}
