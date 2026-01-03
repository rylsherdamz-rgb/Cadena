import { useRouter } from "next/navigation"

export default function CadenaButtons() {
    const router = useRouter()
    // implement the connect wallet ui in here
    return<>
   <button onClick={() => router.push("/admindashboard")} className=" bg-blue-400 focus:outline-none px-5 rounded-2xl py-2">Admin DashBoard</button> 
       <button
       
       className=" bg-violet-400 focus:outline-none px-5 rounded-2xl py-2">Connect your wallet</button> 
  
    </>
      
}