import React from 'react'
import Nav from './Nav';

const Layout = ({children}) => {
  return (
    <div className='mx-4 p-2 md:max-w-2xl md:mx-auto font-poppins bg-orange-100 pb-8'>
        <Nav/>
        <main className='px-2'>
            {children}
        </main>
    </div>
  )
}

export default Layout