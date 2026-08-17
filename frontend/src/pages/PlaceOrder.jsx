import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const [transactionId, setTransactionId] = useState('')

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {

    event.preventDefault()
    if (!token) {
      toast.error('Please login before placing an order')
      navigate('/login')
      return
    }

    try {

      let orderItems = []

      for (const items in cartItems) {

        for (const item in cartItems[items]) {

          if (cartItems[items][item] > 0) {

            const itemInfo = structuredClone(
              products.find(product => String(product._id) === String(items))
            )

            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }

          }

        }

      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
        transactionId: transactionId
      }

      const response = await axios.post(
        backendUrl + '/api/order/place',
        orderData,
        { headers: { token } }
      )

      if (response.data.success) {

        toast.success("Order Placed Successfully")

        setCartItems({})

        navigate('/orders')

      } else {

        toast.error(response.data.message)

      }

    } catch (error) {

      console.log(error)

      toast.error(error.message)

    }

  }

  return (

    <form onSubmit={onSubmitHandler} className='flex-col flex border-t sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]'>

      {/* LEFT SIDE */}

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border py-2 px-3 w-full' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border py-2 px-3 w-full' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email Address' className='border py-2 px-3 w-full' />

        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Full Address / Street' className='border py-2 px-3 w-full' />

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='District / City' className='border py-2 px-3 w-full' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='Area / Thana' className='border py-2 px-3 w-full' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Postcode' className='border py-2 px-3 w-full' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country (e.g. Bangladesh)' className='border py-2 px-3 w-full' />
        </div>

        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone Number' className='border py-2 px-3 w-full' />

      </div>

      {/* RIGHT SIDE */}

      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>

          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='flex gap-3 flex-col'>

            {/* COD */}

            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-3 cursor-pointer'>
              <p className={`min-w-3 h-3 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p>Cash On Delivery</p>
            </div>

            {/* bKash */}

            <div onClick={() => setMethod('bkash')} className='flex items-center gap-3 border p-3 cursor-pointer'>
              <p className={`min-w-3 h-3 border rounded-full ${method === 'bkash' ? 'bg-green-400' : ''}`}></p>
              <p>bKash Payment</p>
            </div>

            {/* Rocket */}

            <div onClick={() => setMethod('rocket')} className='flex items-center gap-3 border p-3 cursor-pointer'>
              <p className={`min-w-3 h-3 border rounded-full ${method === 'rocket' ? 'bg-green-400' : ''}`}></p>
              <p>Rocket Payment</p>
            </div>

          </div>

          {/* Payment Instruction */}

          {method === "bkash" && (
            <div className='mt-4 text-sm text-red-500'>
              Send money to bKash: 01954692669 (replace this number with your official merchant number)
            </div>
          )}

          {method === "rocket" && (
            <div className='mt-4 text-sm text-red-500'>
              Send money to Rocket: 01954692669 (replace this number with your official merchant number)
            </div>
          )}

          {/* Transaction ID */}

          {(method === "bkash" || method === "rocket") && (
            <input
              type="text"
              required
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className='border p-2 mt-3 w-full'
            />
          )}

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>
              PLACE ORDER
            </button>
          </div>

        </div>

      </div>

    </form>

  )

}

export default PlaceOrder