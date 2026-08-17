import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1={'ABOUT '} text2={'US'} />
        </div>

        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nulla magni natus recusandae aut ratione neque illo, corporis ab.exercitationem adipisci beatae quis amet saepe similique labore animi repudiandae quas cumque, dignissimos velit impedit alias quod facere porro? Quo quia quisquam adipisci illo sapiente. Inventore sunt vitae aliquid iusto quos ad voluptatum modi earum, quae velit architecto. Nemo reprehenderit vel odio cum repellendus minus!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae delectus aliquid odio? Dolorem corrupti eos sed illum! Expedita sapiente illo quibusdam adipisci odit quisquam commodi obcaecati magnam quasi. Consequuntur, voluptatibus.</p>
            <b className='text-gray-800'>Our Mission</b>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi dignissimos id est commodi dolorum ad accusamus molestiae laudantium quod distinctio!</p>
          </div>
        </div>

        <div className="text-2xl py-4">
          <Title text1={'WHY '} text2={'CHOOSE US'} />
        </div>

        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, autem perspiciatis reprehenderit explicabo alias dolorum sint voluptatibus blanditiis aspernatur sit.</p>
          </div>

          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Convenience:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, autem perspiciatis reprehenderit explicabo alias dolorum sint voluptatibus blanditiis aspernatur sit.</p>
          </div>

          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, autem perspiciatis reprehenderit explicabo alias dolorum sint voluptatibus blanditiis aspernatur sit.</p>
          </div>
        </div>

        <NewsletterBox/>

    </div>
  )
}

export default About
