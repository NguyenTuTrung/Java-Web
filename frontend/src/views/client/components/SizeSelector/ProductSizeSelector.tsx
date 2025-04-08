import React, { useState } from 'react'

export default function ProductSizeSelector({
  sizes = ['S', 'M', 'L', 'XL'],
  activeClassname = 'p-4 bg-gray-600 text-white rounded-md',
  nonActiveClassname = 'p-4 bg-white text-black rounded-md border border-gray-300 shadow-sm'

}: {
  sizes?: string[]
  activeClassname?: string
  nonActiveClassname?: string
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  return (
    <div className='flex gap-2 '>
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => handleSizeSelect(size)}
          className={selectedSize === size ? activeClassname : nonActiveClassname}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
