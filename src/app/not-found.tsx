import Link from "next/link";

export default function NotFound(){
    return(
        <div className="flex flex-col items-start gap-5 absolute left-[50%] top-[50%] transform translate-[-50%]">
            <h2>welcome to weather rush</h2>
            <p>we couldn't find the page but click on the buttton below to get you favorite weather data.</p>
            <button><Link href='/'>get data</Link></button>
        </div>
    )
}