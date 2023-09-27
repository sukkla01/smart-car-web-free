import React, { useEffect, useState } from "react";
import Department from '../component/Department'
import Hoc from '../component/Layout/Hoc'
import Permission_ from '../component/Permission_';
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'

const Dept = () => {
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

      {role == 'admin' || role == 'superadmin' || role == '' ?
        <Department /> : <Permission_ />}
    </Hoc>
  )
}

export default Dept