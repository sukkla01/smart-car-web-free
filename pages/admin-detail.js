import React, { useEffect, useState } from "react";
import Hoc from '../component/Layout/Hoc'
import AdminDetail_ from '../component/AdminDetail_'
import jwt_decode from "jwt-decode";

const AdminDetail = () => {

  useEffect(() => {
    const token = localStorage.getItem("token");
    localStorage.setItem("NavId", 1);
    if (token == null || token == undefined) {
      router.push('/login')
    } else {
      const decoded = jwt_decode(token);
      
    }

  }, []);
  return (
    
    <Hoc>
        <AdminDetail_ />
    </Hoc>
  )
}

export default AdminDetail