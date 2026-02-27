import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import Database from 'better-sqlite3';
import { NotesResponse } from '@/types/notes';

const dbPath = path.join(process.cwd(), 'public', 'notes.db');
const db = new Database(dbPath);

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