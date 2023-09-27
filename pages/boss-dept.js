import React, { useEffect, useState } from "react";
import Hoc from '../component/Layout/Hoc'
import BossDept_ from '../component/BossDept_'
import Permission_ from '../component/Permission_';
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'

const BossDept = () => {
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
      {role == 'boss_dept' || role == 'superadmin' || role == '' || role == 'boss_admin'  ?
        <BossDept_ /> : <Permission_ />}
    </Hoc>
  )
}

export default BossDept