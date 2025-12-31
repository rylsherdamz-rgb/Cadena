import Image from "next/image"
import { useRouter } from "next/navigation"


export default function Header() {
    const router  = useRouter()
    return <div className="w-full h-full px-10 py-15 flex flex-row ">
      <div className="w-1/2 h-full text-black flex flex-col  gap-y-5  " >
    <p className="text-4xl">
        Transparency is not a promise — it’s a system.
    </p>
    <p>
    In a country where public trust has been tested repeatedly, accountability cannot rely on assurances alone. It requires systems that make misuse difficult, concealment impossible, and audits immediate. By embedding transparency into how public funds are distributed and tracked, the people no longer have to ask where their money went — they can verify it themselves.
    </p>
    <button onClick={() => router.push("/cadena")} className="w-50 rounded-lg bg-black text-white h-10">Get Started</button>
    </div>  
    <div className="w-1/2 h-full  flex justify-center items-center ">
    </div>
    </div>
}