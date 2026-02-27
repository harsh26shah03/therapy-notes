import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import Database from 'better-sqlite3'
import { NoteResponse, NoteType } from '@/types/notes';

const dbPath = path.join(process.cwd(), 'db', 'notes.db')
const db = new Database(dbPath)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  
  const notes = db.prepare('SELECT * FROM notes WHERE id = ?').all(id)

  return NextResponse.json({
    note: notes[0]
  } as NoteResponse)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const body = await request.json()

  const { status } = body as Pick<NoteType, 'status'>

  if (status) {
    db.prepare('UPDATE notes SET status = ? WHERE id = ?').run(status, id)
  }

  return NextResponse.json({
    success: true
  })
}
