"use client"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Toggle(){
    const {theme, setTheme} = useTheme();

    return(
        <button onClick={()=> { setTheme(theme === 'light' ? 'dark' : 'light')}}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                   {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
        </button>
    )
}