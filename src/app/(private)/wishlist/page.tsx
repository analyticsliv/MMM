'use client';
import MyFav from '@/components/MyFavourite/MyFav'
import React from 'react'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Page = () => {
  const { data: session, status } = useSession({required:true});

  // if(status === 'loading') return <div>loading...</div>

  console.log(session, status)
 

  return (
    <div>
      <div className='text-[32px] font-[600] text-center justify-center mb-[32px]'>
        My Favourite
      </div>
      <div>
        <MyFav/>
      </div>
    </div>
  )
}

export default Page