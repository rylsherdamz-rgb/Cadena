"use client"

import CadenaMainContent from "@/components/CadenaMainContent"

//redo the ui of the etherium explorer to have all of that in there

export default function Cadena() {
    return <div className="w-full px-5 py-6  h-screen bg-white">
        <div className="text-black flex flex-row gap-x-10 justify-end px-10  ">
       <button className=" bg-blue-400 px-5 rounded-2xl py-2">Admin DashBoard</button> 
       <button className=" bg-violet-400 px-5 rounded-2xl py-2">Connect your wallet</button> 
        </div>
        <div className="w-full py-5">
            <CadenaMainContent />
        </div>
    </div>
}