import Database from "better-sqlite3"
import { NextRequest, NextResponse } from "next/server"
import path from 'path'
import { v4 as uuidv4 } from 'uuid'


const dbPath = path.join(process.cwd(), 'public', 'notes.db')
const db = new Database(dbPath)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Get all events for this note, oldest first
  const events = db
    .prepare(`
      SELECT id, event_type, data, created_by, created_at
      FROM note_event_log
      WHERE note_id = ?
      ORDER BY created_at ASC
    `)
    .all(id)

  return NextResponse.json({
    events,
  })
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await request.json()
    const { id,note_id, event_type, data, created_by } = body

    db.prepare(`
      INSERT INTO note_event_log
      (id, note_id, event_type, data, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id || uuidv4(),
      note_id,
      event_type,
      data,
      created_by || 'system',
      new Date().toISOString()
    )

    return NextResponse.json({ success: true })
}