import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const statuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers })
      if (response.data.success) setOrders(response.data.orders || [])
      else toast.error(response.data.message || 'Could not load orders')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadOrders() }, [loadOrders])

  const updateStatus = async (orderId, status, paymentStatus) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status, paymentStatus }, { headers })
      if (response.data.success) {
        toast.success('Order status updated')
        loadOrders()
      } else toast.error(response.data.message || 'Update failed')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  if (loading) return <p>Loading orders...</p>

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-xl font-semibold'>All Orders</p>
        <button onClick={loadOrders} className='border px-3 py-2'>Refresh</button>
      </div>

      {orders.length === 0 ? (
        <p className='border p-6 text-center'>No orders found.</p>
      ) : (
        <div className='flex flex-col gap-3'>
          {orders.map(order => (
            <div key={order._id} className='border bg-white p-4'>
              <div className='flex flex-col md:flex-row md:justify-between gap-3'>
                <div>
                  <p className='font-semibold'>Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className='text-sm text-gray-500'>{new Date(order.date || order.createdAt).toLocaleString()}</p>
                  <p className='text-sm mt-1'>Payment: {String(order.paymentMethod).toUpperCase()} · {order.paymentStatus || (order.payment ? 'Paid' : 'Unpaid')}</p>
                  {order.transactionId && <p className='text-sm'>Transaction: {order.transactionId}</p>}
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{currency}{order.amount}</span>
                  <select value={order.status} onChange={e => updateStatus(order._id, e.target.value, order.paymentStatus)} className='border px-2 py-2'>
                    {statuses.map(status => <option key={status}>{status}</option>)}
                  </select>
                  <select value={order.paymentStatus || (order.payment ? 'paid' : 'unpaid')}
                    onChange={e => updateStatus(order._id, order.status, e.target.value)}
                    className='border px-2 py-2'>
                    {['unpaid', 'pending', 'paid', 'failed'].map(status => <option key={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              <div className='mt-4 grid gap-2'>
                {order.items?.map((item, index) => (
                  <div key={`${order._id}-${index}`} className='flex items-center gap-3 border-t pt-2'>
                    <img src={item.image?.[0] || item.images?.[0]} alt='' className='w-12 h-12 object-cover' />
                    <div className='flex-1'>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-500'>Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p>{currency}{item.price}</p>
                  </div>
                ))}
              </div>

              {order.address && (
                <div className='mt-4 text-sm text-gray-600'>
                  <p className='font-medium'>Delivery</p>
                  <p>{order.address.firstName} {order.address.lastName} · {order.address.phone}</p>
                  <p>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}, {order.address.country}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
