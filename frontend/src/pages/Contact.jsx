import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT '} text2={'US'}/>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='font-gray-500'>54709 Dhaka <br/> Narsigdi 1620</p>
          <p className='font-gray-500'>Tel: 01954692669 <br /> Email: munnakhan43217@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='font-gray-500'>Learn more about our teams and job openings</p>
          <button className='border border-black hover:text-white px-8 py-4 mt-2 hover:bg-gray-800 transition-all duration-500'>VIEW OPENINGS</button>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default Contact
