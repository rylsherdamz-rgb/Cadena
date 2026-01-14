"use client"

import CadenaMainContent from "@/components/CadenaMainContent"
import CadenaButtons from "@/components/CadenaTopButtons"

export default function Cadena() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Cadena</h1>
            <p className="text-gray-600">Transparent, on-chain Auditing</p>
          </div>
          <CadenaButtons />
        </div>

        <div className="w-full">
          <CadenaMainContent />
        </div>
      </div>
    </div>
  )
}