"use client";
import React from "react";

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-700 rounded ${className}`} />;
}

export default function PropertyPageSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/3 mb-6" />

      <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] rounded-lg" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />

          <div className="mt-8">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <div className="p-6 border rounded-lg">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    </div>
  );
}
