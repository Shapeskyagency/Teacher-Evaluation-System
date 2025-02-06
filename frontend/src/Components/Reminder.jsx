import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { FormOneReminder } from '../redux/userSlice';

function Reminder(id) {
    const dispatch =  useDispatch()

    const sendEmailReminder = async (ID) =>{
              try {
                const Response  = await dispatch(FormOneReminder(ID.id));
                console.log("Response",Response)
              } catch (error) {
                console.log('error')
              }
               
            }
  return (
    <Button onClick={()=>sendEmailReminder(id)} size="large" className="btn-outline-primary">
            Reminders
          </Button>
  )
}

export default Reminder