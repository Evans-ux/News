`use client`;
import Image from "next/image"
import Link from "next/link"
 
 

export const  Navbar  = ()=>{
   

 

    return(
       <div  className="">

            <div  className="nav flex justify-between   m-6   ">
                
                <Image src="/LOGO.png" alt="logo" width={100} height={40} className="flex align-baseline"/>
                <span className=""><Link  href="/Browse" className="m-3 hover:text-red-500 active:text-blue-500">BROWSE</Link>
                <Link  href="/Trending" className="m-6  hover:text-red-500  active:text-blue-500">TRENDING</Link>
                <Link  href="/Contributors" className="m-6  hover:text-red-500  active:text-blue-500">CONTRIBUTORS</Link>
                <Link  href="" className="m-6  hover:text-red-500  active:text-blue-500">COMMUNITY</Link>
                
                </span>
                <div className=" bg-red-600 p-3"    >
                <Image src="/Search.png" alt="search" width={15} height={5} className="   relaive"/>
                 </div>
            </div>
          
           
            
       </div>
     
    )
}