import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server"
import path from "path";
import { v4 as uuidv4 } from 'uuid'



const dbPath = path.join(process.cwd(), 'public', 'notes.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const version = db.prepare('SELECT * FROM note_versions WHERE note_id = ? ORDER BY created_at DESC').all(id)

  return NextResponse.json({
    version: version[0]
  })
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const { content } = body as { content?: string }

  if (content) {
    db.prepare(
      `
      INSERT INTO note_versions
      (id, note_id, content, created_by, created_at)
      VALUES (?, ?, ?, ?, ?)
    `
    ).run(uuidv4(), id, content, 'system', new Date().toISOString())
  }

  return NextResponse.json({ success: true })
}
