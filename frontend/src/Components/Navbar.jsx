import React from 'react'
import { getUserId } from '../Utils/auth'

function Navbar() {
  const role = getUserId().access
  return (
    <div>
      <div className='d-flex gap-3'>
      <p className='fs-5 fw-bold'>Hi,
        {role === "Superadmin" && " Super admin"}
        {role === "Observer" &&  " Observer"} 
        {role === "Teacher" &&  " Teacher"} 
      </p>
      </div>
    </div>
  )
}

export default Navbar