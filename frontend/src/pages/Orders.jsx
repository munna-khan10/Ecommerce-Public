import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const loadOrders = async () => {
    if (!token) return
    setLoading(true)
    try {
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } })
      if (response.data.success) setOrders(response.data.orders || [])
      else toast.error(response.data.message || 'Could not load orders')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [token])

  if (!token) return <div className='border-t pt-16 text-center'>Please login to view your orders.</div>

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'><Title text1='MY ' text2='ORDERS' /></div>
      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && <p className='text-gray-500'>You have no orders yet.</p>}

      <div className='flex flex-col gap-5'>
        {orders.map(order => (
          <div key={order._id} className='border p-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3'>
              <div>
                <p className='font-medium'>Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className='text-sm text-gray-500'>{new Date(order.date).toLocaleString()}</p>
              </div>
              <div className='text-sm'>
                <p>Status: <span className='font-medium'>{order.status}</span></p>
                <p>Payment: <span className='font-medium'>{String(order.paymentMethod).toUpperCase()} · {order.paymentStatus || (order.payment ? 'Paid' : 'Unpaid')}</span></p>
              </div>
            </div>

            <div className='py-3 flex flex-col gap-3'>
              {order.items?.map((item, index) => (
                <div key={`${order._id}-${index}`} className='flex items-start gap-4'>
                  <img src={item.image?.[0] || item.images?.[0]} className='w-16 sm:w-20 object-cover' alt={item.name || ''} />
                  <div className='flex-1 text-sm'>
                    <p className='font-medium'>{item.name}</p>
                    <p>{currency}{item.price} · Qty: {item.quantity} · Size: {item.size}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='border-t pt-3 flex justify-between font-medium'>
              <span>Total</span>
              <span>{currency}{order.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
