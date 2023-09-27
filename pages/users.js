import React, { useEffect, useState } from "react";
import Hoc from '../component/Layout/Hoc'
import Users_ from '../component/Users/Users_'
import Permission_ from '../component/Permission_';
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'

const Users = () => {
  const router = useRouter()
  const [role, setRole] = useState('');

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
        <Users_ /> : <Permission_ />}
    </Hoc>
  )
}

export default Users