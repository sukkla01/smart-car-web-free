import React, { useEffect, useState } from "react";
import Hoc from '../component/Layout/Hoc'
import BossAdmin_ from '../component/BossAdmin_'
import Permission_ from '../component/Permission_';
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'


const BossAdmin = () => {
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

      {role == 'boss_admin' || role == 'superadmin' || role == ''  ?
        <BossAdmin_ /> : <Permission_ />}
    </Hoc>
  )
}

export default BossAdmin