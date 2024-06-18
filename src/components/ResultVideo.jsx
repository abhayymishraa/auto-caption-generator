import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { FaClosedCaptioning, FaPaintBrush, FaPaintRoller, FaPallet } from "react-icons/fa";
import { convertToSRT } from "../libs/awsTranscriptionHelpers";
import robotoBold from "../fonts/Roboto-Bold.ttf";
import ProgressBar from "./ProgressBar";

export default function ResultVideo({ filename, transcriptionItems }) {
  const [loaded, setLoaded] = useState(false);
  const [primaryColour, setPrimaryColour] = useState("#FFFFFF");
  const [outlineColour, setOutlineColour] = useState("#000000");
  const [progress, setProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const videoURL = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.amazonaws.com/${filename}`;


  useEffect(() => {
    videoRef.current.src = videoURL;
    load();
  }, []);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold));
    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const srt = convertToSRT(transcriptionItems);
    await ffmpeg.writeFile(filename, await fetchFile(videoURL));
    await ffmpeg.writeFile("subs.srt", srt);
    videoRef.current.src = videoURL;
    await new Promise((resolve, reject) => {
      videoRef.current.onloadedmetadata = resolve;
    });
    const { duration } = videoRef.current;
    ffmpeg.on("log", ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if(regexResult && regexResult[1]) {
        const howMuchIsDone = regexResult[1];
        const [hours, minutes, seconds] = howMuchIsDone.split(":");
        const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        const videoProgress = Math.floor((totalSeconds / duration) * 100);
        setProgress(videoProgress);
        console.log(videoProgress);
      }
      console.log(message);
    });
    await ffmpeg.exec([
      "-i",
      filename,
      "-preset",
      "ultrafast",
      "-vf",
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=24,MarginV=100,PrimaryColour=${toFfmpegColour(
        primaryColour
      )},OutlineColour=${toFfmpegColour(
        outlineColour
      )},BackColour=&H000000&,MarginL=20,MarginR=20,MarginV=20,Alignment=2'`,
      "output.mp4",
    ]);
    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
     );
     setProgress(100);
  };

  function toFfmpegColour(colour) {
    const bgr = colour.slice(5, 7) + colour.slice(3, 5) + colour.slice(1, 3);
    return "&H" + bgr + "&";
  }

  return (
    <>
      <button
        onClick={transcode}
        className="flex flex-row sm:mt-4 sm:my-0 my-20 mx-auto bg-text-pretti justify-center items-center text-white font-bold p-2 rounded"
      >
        <FaClosedCaptioning />
        <span className="ml-1">Apply Captions</span>
      </button>
      <div className="flex items-center sm:mt-2 space-x-2">
        <label>Primary Colour :</label>
        <FaPaintBrush />
        <input
          type="color"
          value={primaryColour}
          onChange={(e) => setPrimaryColour(e.target.value)}
          className="w-6 h-6 border-2 border-gray-300 rounded-full" // Tailwind CSS classes
        />
      </div>
      <div className="flex  items-center sm:mt-2 mt-8 space-x-2">
        <label>Outline Colour :</label>
        <FaPaintRoller />
        <input
          type="color"
          value={outlineColour}
          onChange={(e) => setOutlineColour(e.target.value)}
        />
      </div>
      <div className="sm:mt-2 mt-16">
      <ProgressBar progress={progress} />
      </div>
      <div className="rounded-xl overflow-hidden my-16 sm:my-0">
        <video controls ref={videoRef} />
      </div>
      
    </>
  );
}
