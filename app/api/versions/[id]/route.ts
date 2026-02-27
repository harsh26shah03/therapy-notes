import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import Database from 'better-sqlite3'
import fs from 'fs';

const PUBLIC_DB_PATH = path.join(process.cwd(), 'public', 'notes.db')
const TMP_DB_PATH = path.join('/tmp', 'notes.db')

if (!fs.existsSync(TMP_DB_PATH)) {
  fs.copyFileSync(PUBLIC_DB_PATH, TMP_DB_PATH);
}

const db = new Database(TMP_DB_PATH);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const versions = db.prepare('SELECT * FROM note_versions WHERE note_id = ? ORDER BY created_at DESC').all(id)

  return NextResponse.json({
    versions
  })
}
