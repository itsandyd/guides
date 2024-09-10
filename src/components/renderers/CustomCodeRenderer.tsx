'use client'

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className='bg-muted text-muted-foreground rounded-md p-4 overflow-x-auto'>
      <code className='text-sm'>{data.code}</code>
    </pre>
  )
}

export default CustomCodeRenderer
