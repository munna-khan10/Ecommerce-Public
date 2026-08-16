import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navber from './components/Navber'
import Sidebar from './components/Sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000' || 'http://localhost:8000'
export const currency = 'BDT : '

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  useEffect(() => {
    if (token) localStorage.setItem('adminToken', token)
    else localStorage.removeItem('adminToken')
  }, [token])

  if (!token) return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      <Login setToken={setToken} />
    </div>
  )

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      <Navber setToken={setToken} />
      <hr />
      <div className='flex w-full'>
        <Sidebar />
        <div className='w-[70%] mx-auto ml-[max(5vw,30px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/' element={<Add token={token} />} />
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/list' element={<List token={token} />} />
            <Route path='/orders' element={<Orders token={token} />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
