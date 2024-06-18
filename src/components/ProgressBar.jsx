import { FaCheck } from "react-icons/fa";
import ProgressLabel from "./ProgressLabel";

export default function ProgressBar({ progress}) {
  
    if(progress === 0) {
      return null;
    }

    return (
        <>
             <ProgressLabel value={progress} />
            {progress === 100 ? (
                <div className="flex items-center justify-center h-full gap-1 w-full">
                    <h3 className=" font-medium " >Captions Applied</h3>
                    <FaCheck className="text-white animate-pulse" />
                </div>
            ) : (
                <div className="flex items-center justify-center h-full w-full animate-pulse text-white">
                    {`Applying subtitles...`}
                </div>
            )}
        </>
    );
}
