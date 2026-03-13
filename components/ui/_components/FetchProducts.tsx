import { revalidatePath } from 'next/cache'
import React from 'react'


const  fetchdata  = async ()=>{
    const  data  =  await  fetch("https://fake-store-api.mock.beeceptor.com/api/products")
    const  response  =  await  data.json()

    if(data.ok){

        revalidatePath("")

    }
}

const FetchProducts = () => {



  return (
    <div>FetchProducts</div>
  )
}

export default FetchProducts