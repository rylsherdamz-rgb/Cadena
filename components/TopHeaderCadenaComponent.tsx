"use client"

import SearchBarComponent from "./SearchBarComponent"

export default function TopHeaderCadenaComponent() {
  return (
    <div className="w-full flex flex-row items-center gap-4">
      <div className="flex-1 max-w-md">
        <SearchBarComponent />
      </div>
   </div>
  )
}