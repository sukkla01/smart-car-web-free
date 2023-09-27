import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Hoc from '../component/Layout/Hoc'
import Dashboard from '../component/Dashboard'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token == null) {
      router.push('/login')
    }
    localStorage.setItem("NavId", 1);
  }, [])
  return (
    <Hoc>
       <Dashboard />
    </Hoc>

  )
}
