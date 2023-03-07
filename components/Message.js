import React from 'react'

const Message = ({children, avatar, userName, description}) => {
  return (
    <div className='bg-gray-600 text-white p-8 border-b-2 rounded-lg mx-2 my-2'>
        <div className='flex items-center'>
            <img src={avatar} className='w-10 rounded-full'/>
            <h2 className='px-4'>{userName}</h2>
        </div>
        <div>
            <p>{description}</p>
        </div>
        {children}
    </div>
  )
}

export default Message