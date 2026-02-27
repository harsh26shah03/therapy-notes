"use client"; // ← must be first line

import { NoteStatusText } from '@/constants/notes';
import { NoteStatusType } from '@/types/notes'
import { Tag } from 'antd'
import React from 'react'

const statusColorMap = {
  [NoteStatusType.APPROVED]: 'success',
  [NoteStatusType.FAILED]: 'error',
  [NoteStatusType.REJECTED]: 'error',
  [NoteStatusType.IN_REVIEW]: 'processing',
  [NoteStatusType.GENERATING]: 'processing',
  [NoteStatusType.READY_FOR_REVIEW]: 'warning'
} as const

const Status = ({ text }: { text: NoteStatusType }) => {
  const color = statusColorMap[text]
  if (!color) return null
  return <Tag color={color}>{NoteStatusText[text]}</Tag>
}

export default Status