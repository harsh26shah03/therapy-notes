'use client'

import { LogType, NoteType } from '@/types/notes'
import { TableColumnProps, Table, Flex, Typography } from 'antd'
import Status from './Status'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { logEvent } from '@/lib/logs'

const NotesTable = ({ total, notes }: { total: number; notes: NoteType[] }) => {
  const searchParams = useSearchParams()

  const page_number = searchParams.get('page_number') || 1

  const page_size = searchParams.get('page_size') || 10

  const router = useRouter()

  const columns: TableColumnProps<NoteType>[] = [
    {
      key: 'patient_name',
      dataIndex: 'patient_name',
      title: 'Patient Name',
      ellipsis: true,
      width: '25%'
    },

    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      width: '25%',
      render: (text) => <Status text={text} />
    },

    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Created on',
      width: '25%',
      render: (text) => dayjs(text).format('D MMM, YYYY HH:MM')
    },

    {
      key: 'updated_at',
      dataIndex: 'updated_at',
      title: 'Last edited',
      width: '25%',
      render: (text) => dayjs(text).format('D MMM, YYYY HH:MM')
    }
  ]

  return (
    <Flex vertical>
      <Typography.Title level={4}>Therapy Notes</Typography.Title>
      <Table
        columns={columns}
        pagination={{
          total,
          pageSize: Number(page_size),
          current: Number(page_number),
          showTotal: (total) => `${total} Notes`,
          onChange(page, pageSize) {
            router.push(`/sessions?page_number=${page}&page_size=${pageSize}`)
          },
          showSizeChanger: true,
          placement: ['topEnd']
        }}
        dataSource={notes}
        onRow={(record) => {
          return {
            onClick: async () => {
              router.push(`/sessions/${record.id}`)
              await logEvent(record.id, LogType.NOTE_OPENED, {})
            }
          }
        }}
        rowKey={'id'}
      />
    </Flex>
  )
}

export default NotesTable
