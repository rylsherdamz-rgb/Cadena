"use client"

import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {useState} from "react"

export default function CadenaButtons() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  // add a useALayoutEffcet here or useEffect to render that button and use Memo to make this mucch better

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full md:w-auto">
      { isAdmin && (<button
        onClick={() => router.push("/admindashboard")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold text-sm md:text-base"
      >
        Admin Dashboard
      </button>)
      }
     <ConnectButton
        showBalance={false}
        chainStatus="icon"
        accountStatus="address"
      />
    </div>
  )
}
