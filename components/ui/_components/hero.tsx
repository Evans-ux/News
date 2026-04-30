import { ArrowLeft, ArrowRight, Link } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { VisuallyHidden } from "radix-ui"


export const Hero = () =>{
    return(
    <div className="hero relative "> 
    <div className="  " style={{position: `absolute`,
        top: `20%`,
        left: `55%`,
        transform:`translate(-50, -50)`,
        color: `black`,
        textAlign: "left",
       
    }}>
        <a href=""><p style={{
            backgroundColor:"skyblue",
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-around",
            padding:"0.5rem",
            
            
            }}
            className="group  "
            onClick={()=>redirect("/Fruitcomb")}><Link className=" invisible  group-hover:visible "  width={20}/>
            <button  className="bg-white pl-1 pr-1"  style={{color:"#4E9AA9  "}}>New Recipie</button>
            <span>Delicious fruit juice combination</span>
             <ArrowRight/>

        </p></a>
        <b style={{fontWeight: `bold`, fontSize:`5rem`}}>
            Simple and<br/>
            Tasty Juice <br/>
             Recipes.  </b><br/>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br/>
            sed do eiusmod tempor incididunt ut labore et<br/>
            dolore magna aliqua</p></div>
            <Image quality={75} width={1500} height={0} src="/hero picture.png" alt="hero picture"  className=" fill-background bg-cover"/> 
    </div>
    )
}