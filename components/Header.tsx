import Image from "next/image"


export default function Header() {
    return <div className="w-full h-full px-10 py-5 flex flex-row ">
      <div className="w-1/2 h-full text-black text-4xl " >
    <p>
        Transparency is not a promise — it’s a system.
    </p>
    </div>  
    <div className="w-1/2 h-full bg-amber-500 flex justify-center items-center ">
        <Image src="/vector.jpeg" width={100} height={100} alt={"blockchain vector icons"} />
    </div>
    </div>
}