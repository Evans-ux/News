"use client"
import { Suspense } from "react";
 ;
import { ClipLoader } from "react-spinners";
import { Loader } from "lucide-react";
import Skeleton from "@/components/components/Skeleton";

export default function Loading() {
  return (
    <div >
      <Skeleton />
      
    </div>
  );
}