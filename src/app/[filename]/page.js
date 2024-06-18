'use client';

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { clearTranscriptionItems } from "../../libs/awsTranscriptionHelpers";
import { FaSpinner } from "react-icons/fa";
import TranscriptionEditor from "../../components/TranscriptionEditor";
import ResultVideo from "../../components/ResultVideo";






export default function Filename({ params }) {
  const filename = params.filename;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
  const [isFetchingInfo, setIsFetchingInfo] = useState(true);


  useEffect(() => {
    getTranscription();
  }, [filename])


  const getTranscription = useCallback(() => {
    setIsFetchingInfo(true);
    axios.get(`/api/transcribe?filename=${filename}`).then((response) => {
      setIsFetchingInfo(false);
      const status = response.data?.status;
      const transcription = response.data?.transcription;

      if (status === 'IN_PROGRESS') {
        setIsTranscribing(true);
        setTimeout(getTranscription, 3000);
      } else {
        setIsTranscribing(false);
        setAwsTranscriptionItems(clearTranscriptionItems(transcription.results.items));
      }
    });
  }, [filename]);



  if (isTranscribing) {
    return (
      <>
        <div className="flex items-center justify-center flex-col h-[95vh] text-xl font-semibold ">
          <FaSpinner className="animate-spin mr-2 text-yellow-300" />
          <h2 className="text-gray-300">Transcribing...</h2>
          <span className="text-xs text-white">This may take a while</span>
        </div>
      </>
    )
  }

  if (isFetchingInfo) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center bg-black/80 fixed inset-0">
        <div className="flex text-xl font-semibold fon">
          <FaSpinner className="animate-spin mr-2 text-yellow-300" />
          <h2 className="text-gray-300">Fetching Info...</h2>
        </div>
        <span className="text-xs text-white">This may take a while</span>
      </div>
    )
  }

 


  return (
    <div className="mt-20">
      <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-16 gap-20 " >
        <div >
          <TranscriptionEditor awsTranscriptionItems={awsTranscriptionItems} setAwsTranscriptionItems={setAwsTranscriptionItems} />
          <hr className="mt-28 sm:hidden border-gray-300" />
        </div>
        <div className="sm:mb-0 sm:block flex flex-col items-center justify-center " >
          <h2 className="text-2xl font-semibold  text-white/80">Result</h2>
          <ResultVideo filename={filename} transcriptionItems={awsTranscriptionItems} />
        </div>
      </div>
    </div>
  )
}
