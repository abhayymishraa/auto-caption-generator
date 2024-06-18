'use client'
import DemoSection from "../components/DemoSection";
import PageHeaders from "../components/PageHeaders";
import UploadButton from "../components/UploadButton";
import { useState, useEffect } from "react";


export default function page() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulating an asynchronous request
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }, []);
  

  return (
    <>

      <PageHeaders h1={"Add epic captions to your videos"} h2={"Just upload your video and we will do the rest"} />
              <div className="text-center">
                {!isLoading && <UploadButton />}
                <DemoSection />
              </div>
    </>
  );
}
