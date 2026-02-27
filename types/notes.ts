export interface NoteType {
  id: string
  patient_name: string
  status: NoteStatusType
  created_at: string
  updated_at: string
}

export enum NoteStatusType {
  GENERATING = 'GENERATING',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export enum NoteOperationType {
  SAVE_DRAFT = 'SAVE_DRAFT',
  ASSIGN_REVIEWER = 'ASSIGN_REVIEWER',
  START_REVIEW = 'START_REVIEW',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REGENERATE = 'REGENERATE',
  EDIT = 'EDIT'
}

export enum LogType {
  STATUS_CHANGED = 'STATUS_CHANGED',
  NOTE_SAVED = 'NOTE_SAVED',
  NOTE_OPENED = 'NOTE_OPENED',
}

export interface NotesResponse {
  notes: NoteType[]
  total: number
  pages: number
  page_number: number
  page_size: number
}

export interface NoteResponse {
  note: NoteType
}

export interface VersionType {
  id: string
  note_id: string
  content: string
  created_by: string
  created_at: string
}

export interface VersionResponse {
  version: VersionType
}

export interface EventType {
  id: string
  note_id: string
  event_type: LogType
  data: unknown
  created_by: string
  created_at: string
}

export interface EventsResponse {
  events: EventType[]
}
