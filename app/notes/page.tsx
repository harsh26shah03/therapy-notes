import { NotesResponse } from '@/types/notes'
import NotesTable from './components/NotesTable'
import { fetchWithRetry } from '@/lib/retry'

const Home = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const { page_number = 1, page_size = 10 } = await searchParams

  const params = new URLSearchParams({
    page_number: page_number.toString(),
    page_size: page_size.toString()
  })

  const notesResponse = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes?${params.toString()}`)

  const notesJson: NotesResponse = await notesResponse.json()

  const { total, notes } = notesJson

  return (

      <NotesTable total={total} notes={notes} />
  )
}

export default Home
