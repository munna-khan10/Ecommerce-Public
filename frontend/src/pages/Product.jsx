import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProduct from '../components/RelatedProduct'

const Product = () => {

  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const fetchProductData = () => {
    const foundProduct = products.find(item => item._id === productId)

    if (foundProduct) {
      setProductData(foundProduct)
      setImage(foundProduct.images?.[0])
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products]) // ✅ products dependency

  if (!productData) return <div className="opacity-0"></div>

  return (
    <div className='border-t-2 pt-10 transition-opacity duration-500 opacity-100'>

      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Left Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full'>
            {
              productData.images?.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  onClick={() => setImage(item)}
                  className='w-[24%] sm:w-full sm:mb-3 cursor-pointer'
                  alt=""
                />
              ))
            }
          </div>

          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Right Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          <p className='mt-5 text-3xl font-medium'>
            {currency} {productData.price}
          </p>

          <p className='mt-5 text-gray-500 md:w-4/5'>
            {productData.description}
          </p>

          {/* Sizes */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {
                productData.sizes?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 bg-gray-100 ${
                      item === size ? 'bg-green-500 text-white' : ''
                    }`}
                  >
                    {item}
                  </button>
                ))
              }
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className='bg-black text-white px-8 py-3 text-sm'
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </div>
  )
}

export default Product
