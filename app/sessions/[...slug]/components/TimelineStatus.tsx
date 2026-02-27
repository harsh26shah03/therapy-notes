'use client'

import { EventType, LogType, NoteStatusType } from '@/types/notes'
import { CheckOutlined, ClockCircleOutlined, CloseOutlined, EditOutlined, FolderOpenOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Modal, Space, Timeline } from 'antd'
import { TimelineItemType } from 'antd/es/timeline/Timeline'
import dayjs from 'dayjs'
import ReactQuill from 'react-quill-new'

const TimelineStatus = ({ events }: { events: EventType[] }) => {
  const storedEvents = JSON.parse(localStorage.getItem('note_event_logs') || '[]') as EventType[]
  return (
    <Timeline
      items={[...storedEvents, ...events].map((e) => configGenerator(typeof e.data === 'object' ? e.data : JSON.parse(e.data as unknown as string))[e.event_type])}
    />
  )
}

export default TimelineStatus

const noteOpenActivity = (data: unknown): TimelineItemType => {
  const typedData = data as { created_at: string }
  return {
    icon: (
      <FolderOpenOutlined
        style={{
          fontSize: 20
        }}
      />
    ),
    content: `The note was opened at ${dayjs(typedData.created_at).format('D MMM, YYYY HH:MM')}`
  }
}

const noteSaveActivity = (data: unknown): TimelineItemType => {
  const typedData = data as { created_at: string; content: string }
  return {
    icon: (
      <SaveOutlined
        style={{
          fontSize: 20
        }}
      />
    ),
    content: (
      <Space>
        {`The note was saved at ${dayjs(typedData.created_at).format('D MMM, YYYY HH:MM')}`}
        <Button
          type="link"
          onClick={() => {
            Modal.info({
              title: `Version saved at ${dayjs(typedData.created_at).format('D MMM, YYYY HH:MM')}`,
              content: (
                <ReactQuill
                  theme="snow"
                  value={typedData.content || ''}
                  style={{
                    height: '60vh',
                    paddingBottom: '4rem'
                  }}
                  readOnly={true}
                />
              ),
              width: '70vw'
            })
          }}
        >
          See
        </Button>
      </Space>
    )
  }
}

const statusActivity = (data: unknown): TimelineItemType => {
  const typedData = data as { status: string }
  switch (typedData.status) {
    case NoteStatusType.APPROVED:
      return {
        icon: (
          <CheckOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        content: `Status was changed to Approved`
      }
    case NoteStatusType.FAILED:
      return {
        icon: (
          <CloseOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        color: 'red',
        content: 'Status was changed to Failed'
      }
    case NoteStatusType.GENERATING:
      return {
        icon: (
          <SyncOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        content: 'Status was changed to Generating'
      }
    case NoteStatusType.IN_REVIEW:
      return {
        icon: (
          <ClockCircleOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        content: 'Status was changed to In review'
      }
    case NoteStatusType.READY_FOR_REVIEW:
      return {
        icon: (
          <EditOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        content: 'Status was changed to Ready for review'
      }
    case NoteStatusType.REJECTED:
      return {
        icon: (
          <CloseOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        color: 'red',
        content: 'Status was changed to Generating'
      }
    default:
      return {
        icon: (
          <CloseOutlined
            style={{
              fontSize: 20
            }}
          />
        ),
        color: 'red',
        content: 'Status was changed to Generating'
      }
  }
}

const configGenerator = (data: unknown): Record<LogType, TimelineItemType> => {
  return {
    [LogType.STATUS_CHANGED]: statusActivity(data),
    [LogType.NOTE_OPENED]: noteOpenActivity(data),
    [LogType.NOTE_SAVED]: noteSaveActivity(data)
  }
}
