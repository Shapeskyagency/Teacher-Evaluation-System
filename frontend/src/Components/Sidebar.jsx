import React from 'react'
import { Menu } from './Data'
import { getUserId } from '../Utils/auth'
import { Link } from 'react-router-dom'

function Sidebar() {
  const Role = getUserId().access
  return (
    <>
  <h2 className='pt-3'>App Name</h2>
    <div className='d-flex flex-column pt-5 px-3'>
      {Menu[Role].map((item,index)=>{
        return(
          item.name !=="Logout"?
          <Link key={index} className='btn btn-primary mb-3' to={item.route}>{item.name}</Link>
          :
          <Link key={index} className='btn btn-outline-primary mb-3' onClick={item.logout}>{item.name}</Link>
        )
      })}
    </div>
    </>
  )
}

export default Sidebar