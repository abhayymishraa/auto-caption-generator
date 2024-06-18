import SparkleIcon from "./Sparkles";

export default function DemoSection(){
  return(
    <div className="flex sm:flex-row flex-col mt-16 justify-around items-center gap-20" >
    <div className="bg-gray-800/50 max-w-[240px] rounded-xl object-cover overflow-hidden ">
        <video controls src="/videos/Chad.mp4" />
    </div>
    <div>
    <SparkleIcon />
    </div>
    <div className="bg-gray-800/50 max-w-[240px] rounded-xl object-cover overflow-hidden ">
        <video controls src="/videos/Chad-transcribed.mp4" />
    </div>
  </div>
)
}