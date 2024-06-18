import PageHeaders from "../../components/PageHeaders";


export default function page(){
  return (
    <div>
        <PageHeaders
        h1={'Check out our pricing'}
        h2={'Our pricing is simple and transparent. No hidden fees.'}
        />
        <div className="bg-white text-slate-700 p-4 text-center text-blue-gray-600 mx-auto rounded-lg max-w-xs">
            <h3 className="font-bold text-3xl" >Free</h3>
            <h4 className="font-light">Free forever</h4>
        </div>
    </div>
  )
}
