import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import Database from 'better-sqlite3'

const dbPath = path.join(process.cwd(), 'public', 'notes.db')
const db = new Database(dbPath)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const versions = db.prepare('SELECT * FROM note_versions WHERE note_id = ? ORDER BY created_at DESC').all(id)

  return NextResponse.json({
    versions
  })
}
