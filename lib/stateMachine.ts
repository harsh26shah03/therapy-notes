import { NoteOperationType, NoteStatusType } from '@/types/notes'

const machine: Record<NoteStatusType, Partial<Record<NoteOperationType, NoteStatusType>>> = {
  [NoteStatusType.GENERATING]: {
    // [NoteOperationType.REGENERATE]: NoteStatusType.GENERATING,
    [NoteOperationType.START_REVIEW]: NoteStatusType.READY_FOR_REVIEW
  },

  [NoteStatusType.READY_FOR_REVIEW]: {
    [NoteOperationType.ASSIGN_REVIEWER]: NoteStatusType.IN_REVIEW,

    [NoteOperationType.EDIT]: NoteStatusType.GENERATING
  },

  [NoteStatusType.IN_REVIEW]: {
    [NoteOperationType.APPROVE]: NoteStatusType.APPROVED,
    [NoteOperationType.REJECT]: NoteStatusType.REJECTED,

    [NoteOperationType.EDIT]: NoteStatusType.GENERATING
  },

  [NoteStatusType.REJECTED]: {
    [NoteOperationType.START_REVIEW]: NoteStatusType.READY_FOR_REVIEW,

    [NoteOperationType.EDIT]: NoteStatusType.GENERATING
  },

  [NoteStatusType.APPROVED]: {
    [NoteOperationType.EDIT]: NoteStatusType.GENERATING
  },

  [NoteStatusType.FAILED]: {
    [NoteOperationType.REGENERATE]: NoteStatusType.GENERATING,

    [NoteOperationType.EDIT]: NoteStatusType.GENERATING
  }
}

export const getAllowedOps = (state: NoteStatusType) => {
  return Object.keys(machine[state] || {}) as NoteOperationType[]
}

export const canExecute = (state: NoteStatusType, op: NoteOperationType) => {
  return !!machine[state]?.[op]
}

export const executeOp = (state: NoteStatusType, op: NoteOperationType, cb?: (nextState: NoteStatusType) => void) => {
  const nextState = machine[state]?.[op]

  if (!nextState) {
    throw new Error(`Operation ${op} not allowed in state ${state}`)
  }

  cb?.(nextState)

  return nextState
}
