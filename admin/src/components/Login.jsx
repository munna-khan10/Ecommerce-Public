import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        toast.success('Admin login successful')
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className='w-[90%] max-w-md mx-auto pt-24 flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Admin Login</h1>
      <input required type='email' value={email} onChange={e => setEmail(e.target.value)}
        placeholder='Admin email' className='border px-3 py-3' />
      <input required type='password' value={password} onChange={e => setPassword(e.target.value)}
        placeholder='Admin password' className='border px-3 py-3' />
      <button disabled={loading} className='bg-black text-white py-3'>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export default Login
