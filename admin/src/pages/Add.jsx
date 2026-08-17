import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import {backendUrl} from '../App'
import { toast } from 'react-toastify';




const Add = () => {
const token = localStorage.getItem("adminToken");


  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name,setName] = useState("")
  const [description,setDiscription] = useState("")
  const [price,setPrice] = useState("")
  const [category,setCategory] = useState("Man")
  const [subCategory,setSubCategory] = useState("Topwear")
  const [bestseller,setBestseller] = useState(false)
  const [sizes,setSizes] = useState([])
  const [stock, setStock] = useState('')

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!image1 || !name.trim() || !description.trim() || !price || Number(price) < 0 || !sizes.length || stock === '' || Number(stock) < 0) {
    toast.error('Fill all required fields, upload at least one image, select a size, and enter stock')
    return
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", JSON.stringify(bestseller));
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("stock", stock);

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    const response = await axios.post(
      backendUrl + "/api/product/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if(response.data.success) {
      toast.success("Product added successfully!");
      setName('')
      setDiscription('')
      setImage1(false)
      setImage2(false)
      setImage3(false)
      setImage4(false)
      setPrice('')
      setStock('')
      setSizes([])
    }else{
      toast.error(response.data.message)
    }

     // nicer UX
  } catch (error) {
    console.error("Add product error:", error);
    toast.error("Failed to add product");
  }
};


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col gap-3 w-full items-start'>
      <div>
        <p className='mb-3'>Upload Image</p>

        <div className='gap-2 flex'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
      
          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
      
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
        
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>

      </div>

      <div className='w-full'>
        <p className='mb-3'>Products Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Type here' className='w-full max-w-[500px] px-3 py-2 outline-green-400 bg-slate-200 border-r-8' required/>
      </div>

      <div className='w-full'>
        <p className='mb-3'>Products Description</p>
        <textarea onChange={(e)=>setDiscription(e.target.value)} value={description} type="text" placeholder='Write Content here' className='w-full max-w-[500px] px-3 py-2 outline-green-400 bg-slate-200 border-r-8' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-3'>Product Catagory</p>
            <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Man">Man</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className='mb-3'>Sub Catagory</p>
            <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Product Price</p>
            <input required min='0' onChange={(e)=>setPrice(e.target.value)} value={price} className=' w-full py-2 sm:w-[120px] px-3' type="number" placeholder='25' />
            <p className='mb-2 mt-3'>Stock</p>
            <input required min='0' onChange={(e)=>setStock(e.target.value)} value={stock} className='w-full py-2 sm:w-[120px] px-3' type='number' placeholder='0' />
          </div>


      </div>

      <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
              <p className={`${sizes.includes("S") ? "bg-green-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
              <p className={`${sizes.includes("M") ? "bg-green-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
              <p className={`${sizes.includes("L") ? "bg-green-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
              <p className={`${sizes.includes("XL") ? "bg-green-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
              <p className={`${sizes.includes("XXL") ? "bg-green-300" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
            </div>

          </div>
      </div>

      <div className='gap-2 mt-2 flex'>
        <input onChange={()=> setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit'
 className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add
