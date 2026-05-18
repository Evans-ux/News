"use client"
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10 min-h-screen">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3 xl:w-3/4 space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}