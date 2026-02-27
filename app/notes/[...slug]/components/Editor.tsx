'use client'
import { logEvent } from '@/lib/logs'
import { saveNote } from '@/lib/notes'
import { LogType, NoteStatusType } from '@/types/notes'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export function Editor({ status, content }: { status: NoteStatusType; content?: string }) {
  const [value, setValue] = useState<string>(content ?? '')

  const { slug } = useParams()

  useEffect(() => {
    if (slug) {
      localStorage.setItem(`note-draft-${slug[0]}`, value)
      localStorage.setItem(`note-draft-${slug[0]}-status`, 'PENDING')
    }

    const saveInterval = setInterval(async () => {
      if (slug) {
        const content = localStorage.getItem(`note-draft-${slug[0]}`)

        const isDone = localStorage.getItem(`note-draft-${slug[0]}-status`) === 'DONE'

        if (content && !isDone) {
          await saveNote(slug[0], content)
          await logEvent(slug[0], LogType.NOTE_SAVED, { content })
          localStorage.setItem(`note-draft-${slug[0]}-status`, 'DONE')
        }
      }
    }, 10000)

    return () => {
      clearInterval(saveInterval)
    }
  }, [slug, value])

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={(value) => {
        setValue(value)
      }}
      style={{
        height: '80vh'
      }}
      readOnly={status !== NoteStatusType.GENERATING}
    />
  )
}
