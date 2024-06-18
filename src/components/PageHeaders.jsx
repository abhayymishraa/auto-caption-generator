

export default function PageHeaders({
    h1,
    h2
}){
  return (
    <div className="text-center mt-24 mb-8" >
    <h1 className=" font-extrabold text-3xl"  >{h1}</h1>
    <h2 className="font-medium" >{h2}</h2>
  </div>
  )
}
