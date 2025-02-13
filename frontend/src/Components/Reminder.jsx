import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { FormOneReminder, FormTwoReminder } from '../redux/userSlice';

function Reminder({id,type}) {
    const dispatch =  useDispatch()

    const sendEmailReminder = async (ID) =>{
              try {
                let Response;
                if(type==='form2'){
                   Response  = await dispatch(FormTwoReminder(ID));
                }else{
                   Response = await dispatch(FormOneReminder(ID));
                }
                
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