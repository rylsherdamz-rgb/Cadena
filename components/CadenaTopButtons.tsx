"use client"

import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function CadenaButtons() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => router.push("/admindashboard")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-2xl transition focus:outline-none"
      >
        Admin Dashboard
      </button>

      <ConnectButton
        showBalance={false}
        chainStatus="icon"
        accountStatus="address"
      />
    </div>
  )
}
