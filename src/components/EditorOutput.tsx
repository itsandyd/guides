'use client'

import CustomCodeRenderer from '@/components/renderers/CustomCodeRenderer'
import CustomImageRenderer from '@/components/renderers/CustomImageRenderer'
import { FC } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

interface EditorOutputProps {
  content: any
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  const { theme } = useTheme()

  return (
    <div className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Output
        style={style}
        className='prose dark:prose-invert max-w-none'
        renderers={renderers}
        data={content}
      />
    </div>
  )
}

export default EditorOutput
