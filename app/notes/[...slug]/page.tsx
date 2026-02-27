import { fetchWithRetry } from '@/lib/retry'
import NoteDetails from './components/NoteDetails'
import { EventsResponse, NoteResponse, VersionResponse } from '@/types/notes';

const NoteDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  const noteResponse = await fetchWithRetry(`http://localhost:3000/api/note/${slug[0]}`)

  const noteJson: NoteResponse = await noteResponse.json()

  const { note } = noteJson

  const contentResponse = await fetchWithRetry(`http://localhost:3000/api/version/${slug[0]}`)

  const versionJson: VersionResponse = await contentResponse.json()

  const { version } = versionJson

  const eventsResponse = await fetchWithRetry(`http://localhost:3000/api/logs/${slug[0]}`)

  const eventsJson: EventsResponse = await eventsResponse.json()

  const { events } = eventsJson

  return <NoteDetails note={note} version={version} events={[...events]} />
}

export default NoteDetailsPage
