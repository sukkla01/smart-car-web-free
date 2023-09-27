import React, { useEffect, useState } from "react";
import Hoc from '../component/Layout/Hoc'
import Reserve_ from '../component/Reserve/Reserve_'
import Permission_ from '../component/Permission_';
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'

const Reserve = () => {

  const [role, setRole] = useState('');
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null || token == undefined) {
      router.push('/login')
    } else {
      const decoded = jwt_decode(token);
      setRole(decoded.role)
    }
  }, []);
  return (
    <Hoc>
      {role == 'user' || role == 'admin' || role == 'boss_dept' || role == 'boss_admin' || role == 'superadmin' || role == '' ?
        <Reserve_ /> : <Permission_ />}
    </Hoc>
  )
}

export default Reserve