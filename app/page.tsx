'use client';
import { Input } from 'antd'

const HomePage = () => {

  return (
    <Input.OTP
      formatter={(str) => str.toUpperCase()}
      onChange={(val) => {
        if (val === '123456') {
          window.location.href = '/notes'
        }
      }}
      size='large'
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  )
}

export default HomePage
