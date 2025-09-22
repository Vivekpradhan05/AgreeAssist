import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
       <div className='relative'>
          <img src={assets.main_banner_bg} alt="Banner" className='w-full hidden md:block'/>
          <img src={assets.main_banner_bg_sm} alt="Banner" className='w-full md:hidden'/>
          <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:ppl-24'>
                  <h1 className='text-3x1 md:text-4x1 lg:text-5x1 font-bold text-center md:text-left max-w-72 md:max-w-80 md:max=w-105 leading-tight lg:leading-15 '>
                    Freshness You can Trush, Saving You will Love!</h1>
          

          <div className='flex items-center mt-6 font-medium'>

              <Link to={"/products"} className='items-center bg-green-400 gap-2 rounded group flex px-7 md:px-9 py-9 hover:bg-green text-white cursor-pointer'>
              Shop Now
              <img  src={assets.white_arrow_icon} alt="arrow" />
              </Link>


              <Link to={"/products"} className='group hidden md:flex item-center gap-2 px-9 py-3 cursor-pointer bg-green-400'>
              Explore Deals
              <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
              </Link>

          </div>
          </div>
    </div>

  )
}

export default MainBanner
