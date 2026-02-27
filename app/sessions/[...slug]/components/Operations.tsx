'use client'
import { logEvent } from '@/lib/logs'
import { changeNoteStatus } from '@/lib/notes'
import { executeOp } from '@/lib/stateMachine'
import { LogType, NoteOperationType, NoteStatusType } from '@/types/notes'
import { CheckOutlined, CloseOutlined, EditFilled, SaveOutlined, SignatureOutlined, SyncOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, ButtonProps } from 'antd'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'

type OperationsProps = {
  operation: NoteOperationType
  status: NoteStatusType
}

const OPERATION_CONFIG: Record<NoteOperationType, ButtonProps & { label: string }> = {
  [NoteOperationType.EDIT]: {
    label: 'Edit',
    icon: <EditFilled />
  },
  [NoteOperationType.REGENERATE]: {
    label: 'Regenerate',
    icon: <SyncOutlined />
  },
  [NoteOperationType.ASSIGN_REVIEWER]: {
    label: 'Assign Reviewer',
    icon: <UserAddOutlined />
  },
  [NoteOperationType.APPROVE]: {
    label: 'Approve',
    icon: <CheckOutlined />
  },
  [NoteOperationType.REJECT]: {
    label: 'Reject',
    icon: <CloseOutlined />
  },
  [NoteOperationType.SAVE_DRAFT]: {
    label: 'Save Draft',
    icon: <SaveOutlined />
  },
  [NoteOperationType.START_REVIEW]: {
    label: 'Start Review',
    icon: <SignatureOutlined />
  }
}

const Operations = ({ operation, status }: OperationsProps) => {
  const config = OPERATION_CONFIG[operation]

  const { slug } = useParams()

  const executeAction = useCallback(() => {
    if (!slug) return
    executeOp(status, operation, async (nextState) => {
      await logEvent(slug[0], LogType.STATUS_CHANGED, { status: nextState })

      await changeNoteStatus(slug[0], nextState)
    })
  }, [slug, operation, status])

  if (!config) return null

  return (
    <Button
      type={config.type ?? 'primary'}
      icon={config.icon}
      onClick={() => {
        executeAction()
      }}
    >
      {config.label}
    </Button>
  )
}

export default Operations
