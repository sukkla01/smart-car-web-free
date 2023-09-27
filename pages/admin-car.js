import React, { useEffect, useState } from "react";
import Hoc from '../component/Layout/Hoc'
import AdminCar_ from '../component/AdminCar_'
import Permission_ from '../component/Permission_';
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router'

const AdminCar = () => {
  const router = useRouter()
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null || token == undefined) {
      router.push('/login')
    } else {
      const decoded = jwt_decode(token);
      setRole(decoded.role)
      // console.log(decoded.role)
    }

  }, []);


  return (
    // <div>ddd</div>
    <Hoc>
      {role == 'admin' || role == 'superadmin' || role == '' ?
        <AdminCar_ /> : <Permission_ />}
    </Hoc>
  )
}

export default AdminCar