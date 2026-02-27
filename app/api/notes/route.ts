import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { NotesResponse } from '@/types/notes';

const PUBLIC_DB_PATH = path.join(process.cwd(), 'public', 'notes.db')
const TMP_DB_PATH = path.join('/tmp', 'notes.db')

if (!fs.existsSync(TMP_DB_PATH)) {
  fs.copyFileSync(PUBLIC_DB_PATH, TMP_DB_PATH);
}

const db = new Database(TMP_DB_PATH);


export async function GET(request:NextRequest): Promise<NextResponse<NotesResponse>> {
  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get('page_number') || '1', 10);
  const pageSize = parseInt(searchParams.get('page_size') || '10', 10);

  const offset = (pageNumber - 1) * pageSize;

  const totalCount = (db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number }).count;

  const notes = db
    .prepare('SELECT * FROM notes ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(pageSize, offset);

  return NextResponse.json({
    page_number: pageNumber,
    page_size: pageSize,
    total: totalCount,
    pages: Math.ceil(totalCount / pageSize),
    notes,
  } as NotesResponse);
}