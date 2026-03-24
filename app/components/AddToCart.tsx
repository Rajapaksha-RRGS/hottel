'use client';
import React from 'react'

const AddToCart = () => {
  return (
    <div>
      <button className='cursor-pointer bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded' onClick={()=> console.log("Click")}>Add TO Cart</button>
    </div>
  )
}

export default AddToCart
