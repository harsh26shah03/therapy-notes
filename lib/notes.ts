'use server';
import { revalidatePath } from 'next/cache'
import { fetchWithRetry } from './retry'

export const saveNote = async (id: string, content: string) => {
  await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}/api/version/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content
    })
  })
  revalidatePath(`/${id}`, 'page')
}

export const changeNoteStatus = async (id: string, status: string) => {
  await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}/api/note/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status
    })
  })

  revalidatePath(`/${id}`, 'page')
}