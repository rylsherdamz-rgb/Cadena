import SearchBarComponent from "./SearchBarComponent"

export default function TopHeaderCadenaComponent() {
    return <div className="w-full h-[10vh] flex flex-row">
        <div className="w-[20%] h-full">
            <SearchBarComponent />
        </div>
        <div className="w-[80%] h-full">

        </div>



    </div>
}