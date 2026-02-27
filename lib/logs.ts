import { fetchWithRetry } from "./retry"

export const Events = {
  STATUS_CHANGED: 'STATUS_CHANGED',
  NOTE_SAVED: 'NOTE_SAVED',
  NOTE_OPENED: 'NOTE_OPENED'
} as const

type EventType = keyof typeof Events

export async function logEvent(note_id: string, event_type: EventType, data: unknown = {}) {
  await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}api/logs/${note_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      note_id,
      event_type,
      data: JSON.stringify(data),
      created_by: 'system'
    })
  })
}
