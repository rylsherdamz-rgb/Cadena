import React, { useState } from "react"



export default function SearchBarComponent() {
    const [search, setSearch] = useState<string>("")
    
    const handleSubmitSearch = (e :  React.ChangeEvent<HTMLInputElement>) => {
     setTimeout(() => setSearch(e.target.value), 500)
    }
    return <div className="w-full h-full">
        <input
        value={search}
        onChange={(e) =>{
            setTimeout(() => setSearch(e.target.value), 500)
        }}
         className="focus:outline-none bg-white px-4 py-2 rounded-2xl text-black"  placeholder="Search Contracts.." />
    </div>
}