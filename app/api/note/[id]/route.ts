import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import Database from 'better-sqlite3'
import { NoteResponse, NoteType } from '@/types/notes';
import fs from 'fs';

const PUBLIC_DB_PATH = path.join(process.cwd(), 'public', 'notes.db')
const TMP_DB_PATH = path.join('/tmp', 'notes.db')

if (!fs.existsSync(TMP_DB_PATH)) {
  fs.copyFileSync(PUBLIC_DB_PATH, TMP_DB_PATH);
}

const db = new Database(TMP_DB_PATH);

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
