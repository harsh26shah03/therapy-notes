// generateNotesDb.js
import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// -----------------------------
// Define allowed states
// -----------------------------
export const States = {
  GENERATING: 'GENERATING',
  READY_FOR_REVIEW: 'READY_FOR_REVIEW',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
} as const;

// -----------------------------
// DB Setup
// -----------------------------
const dbPath = path.join(process.cwd(), 'public', 'notes.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// -----------------------------
// NOTES TABLE (NO CONTENT)
// -----------------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    status TEXT NOT NULL,
    reviewer TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`).run();

// -----------------------------
// VERSION HISTORY TABLE
// -----------------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS note_versions (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  )
`).run();

// -----------------------------
// EVENT LOG TABLE (focused events)
// -----------------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS note_event_log (
    id TEXT PRIMARY KEY,
    note_id TEXT,
    event_type TEXT NOT NULL,
    data TEXT,
    created_by TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  )
`).run();


// -----------------------------
// CLEAR EXISTING DATA
// -----------------------------
db.prepare('DELETE FROM note_event_log').run();
db.prepare('DELETE FROM note_versions').run();
db.prepare('DELETE FROM notes').run();

// -----------------------------
// EVENT TYPES (simplified)
// -----------------------------

function createVersion(noteId:string, delta:unknown) {

  db.prepare(`
    INSERT INTO note_versions
    (id, note_id, content, created_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    uuidv4(),
    noteId,
    JSON.stringify(delta),
    'system',
    new Date().toISOString()
  );

}

// -----------------------------
// DUMMY DATA
// -----------------------------
const names = [
  'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Green',
  'Diana White', 'Ethan Black', 'Fiona Red', 'George Blue', 'Hannah Gray',
  'Ian Silver', 'Julia Gold', 'Kevin Orange', 'Laura Violet', 'Michael Cyan'
];

function randomStatus() {
  const values = Object.values(States);
  return values[Math.floor(Math.random() * values.length)];
}

// -----------------------------
// INSERT SAMPLE NOTES
// -----------------------------
const insertNote = db.prepare(`
  INSERT INTO notes (id, patient_name, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?)
`);

names.forEach((name) => {
  const id = uuidv4();
  const now = new Date().toISOString();
  const status = randomStatus();

  insertNote.run(id, name, status, now, now);

  // Create initial version (empty content example)
  createVersion(
    id,
    '<p>hi</p><p>This is a sample note for ' + name + ' with status ' + status + '.</p>'
  );
});

db.close();