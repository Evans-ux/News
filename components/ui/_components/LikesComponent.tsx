"use client"
import React, { useState } from 'react'
import IncreremntLike from './actions/IncreremntLike'
import { Button } from '../ui/button'

const LikesComponent = ({initialLikes}: {initialLikes:number}) => {

    const  [likes, setLikes] =  useState(0)
    const  [color,  setColor] = useState("green")
    const  [inputColor,  setInputColor] =  useState("")
    const  [initial, setinnitiallike] =  useState(initialLikes)
    const [isLoggedin, setisLoggedin] = useState(false)
   
    const  changeColor = (color:string)=>{
        return setColor(color)
    }


  return (
    <div>
        the initialLike:{likes}, 
                <button style={{color:color}} className='font-extrabold' onClick={()=>setLikes((prevState)=> prevState + 1)}>updateLikes</button><br/>


        The  TotalLikes  =  {initial}
        
        <button onClick={ async ()=>{

            const  updatelike  =  await IncreremntLike()
            setinnitiallike(updatelike.likes)

        }}>like  the post</button><br/>


        <input onChange={(e)=>setInputColor(e.target.value)} style={{backgroundColor: "teal"}} type='text' />

        <button onClick={()=>changeColor(inputColor)}>chnage color</button>


        <br/>
       {isLoggedin ?(
        <h2>Welcome back</h2>
       ) : (
        <h2>Please Login</h2>
       )}
               <p
          style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '13px',
            marginTop: '20px',
          }}
        >
          {isLoggedin ? "Don't have an account? " : 'Already have an account? '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setisLoggedin(!isLoggedin);
               
            }}
            style={{
              color: '#667eea',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            {isLoggedin ? 'Sign up' : 'Sign in'}
          </a>
        </p>
    </div>
  )
}

export default LikesComponent