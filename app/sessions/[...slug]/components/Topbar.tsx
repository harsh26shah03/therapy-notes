'use client';;
import Status from '@/app/sessions/components/Status'
import { getAllowedOps } from '@/lib/stateMachine'
import { NoteStatusType, NoteType } from '@/types/notes'
import { Flex, Tag, Typography } from 'antd';
import Operations from './Operations'

const Topbar = ({ patient_name, status }: Pick<NoteType, 'patient_name' | 'status'>) => {

  return (
    <Flex justify="space-between" align="center">
      <Flex align="center" gap={'1rem'}>
        <Typography.Title level={5} style={{margin:0}}>{`Notes for ${patient_name}`}</Typography.Title>
        {status !== NoteStatusType.GENERATING && <Tag color={'default'} >Read Only</Tag>}
        <Status text={status} />
      </Flex>
      <Flex align="center" gap={'1rem'}>
        {getAllowedOps(status).map((ops) => (
          <Operations key={ops} operation={ops} status={status} />
        ))}
      </Flex>
    </Flex>
  )
}

export default Topbar
