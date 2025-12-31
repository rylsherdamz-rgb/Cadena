import Link from "next/link"
import {Badge} from "lucide-react"


export default function Navigation() {
    const NavigationItems = ["Rock Game", "Blockchain", "About Us"  ]
    return <div className="w-full h-[10vh] flex bg-white flex-row justify-between gap-x-5 px-10 py-6">
        <div className="flex flex-row text-black gap-x-2"               >
            <Badge size={24} color="#000" />
            <p className="font-semibold text-lg">
            Cadena
            </p>
        </div>
        <div className="py-2 flex flex-row gap-x-5">
        {NavigationItems.map((item, index) => (
            <div key={index} className="text-black font-semibold text-md"> {item} </div>
        ))}


        </div>
    </div>
}