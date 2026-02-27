import { Col, Flex, Row } from 'antd'
import Topbar from './Topbar'
import { EventType, NoteType, VersionType } from '@/types/notes'
import { Editor } from './Editor'
import TimelineStatus from './TimelineStatus'

const NoteDetails = ({ note, version, events }: { note: NoteType; version: VersionType; events: EventType[] }) => {
  const { patient_name, status } = note

  const { content } = version
  return (
    <Flex vertical gap={'2rem'} style={{height: '95%'}}>
      <Topbar patient_name={patient_name} status={status} />
      <Row gutter={40} style={{height: '100%'}}>
        <Col span={18}>
          <Editor status={status} content={content} />
        </Col>
        <Col span={6} style={{height: '100%', overflow: 'scroll'}} >
          <TimelineStatus events={events} />
        </Col>
      </Row>
    </Flex>
  )
}

export default NoteDetails
