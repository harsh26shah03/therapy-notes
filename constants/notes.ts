import { NoteStatusType } from "@/types/notes";

export const NoteStatusText: Record<keyof typeof NoteStatusType, string> = {
  GENERATING: 'Generating',
  READY_FOR_REVIEW: 'Ready for Review',
  IN_REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  FAILED: 'Failed'
}

export const Events = {
  STATUS_CHANGED: 'STATUS_CHANGED',
  NOTE_SAVED: 'NOTE_SAVED',
  NOTE_OPENED: 'NOTE_OPENED',
  FILTER_APPLIED: 'FILTER_APPLIED',
};
