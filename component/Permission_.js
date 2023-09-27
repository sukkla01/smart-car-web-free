import React from 'react'
import { Alert, Space } from 'antd';

const Permission_ = () => {
  return (
    <div>
      <Alert
        className='mt-5 text-xl'
        message="Permission Denied"
        description="คุณไม่มีสิทธิ์เข้าใช้งาน กรุณาติดต่อผู้ดูแลระบบ"
        type="warning"
        showIcon
        closable
      />
    </div>
  )
}

export default Permission_