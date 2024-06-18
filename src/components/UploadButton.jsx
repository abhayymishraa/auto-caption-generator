"use client";

import axios from "axios";
import UploadIcon from "./UploadIcon";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";


export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  async function onFileChange(event) {
    event.preventDefault();
    const files = event.target.files;
    if (files[0].size > 2 * 1024 * 1024) {
      alert("File size cannot exceed 2MB");
      return;
    }
    console.log(files);
    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      const res = await axios.postForm("/api/upload", {
        file,
      });
      setIsUploading(false);
      files.value = null;
      event.target.value = "";
      const newName = res.data.fileName;
      router.push(`/${newName}`);
    }
  }

  return (
    <>
      {isUploading && (
        <div>
          <div className="flex flex-col gap-2 items-center justify-center bg-black/80 fixed inset-0">
            <div className="flex text-xl font-semibold fon">
            <FaSpinner className="animate-spin mr-2 text-yellow-300" />
            <h2 className="text-gray-300">Uploading...</h2>
            </div>
            <span className="text-xs text-white">This may take a while</span>
          </div>
        </div>
      )}
      <label className="rounded-full py-2 px-6 bg-green-400 inline-flex gap-1 border-2 border-purple-700/50 cursor-pointer">
        <UploadIcon />
        <span>Choose file {"(<2mb) "}  </span>
        <input onChange={onFileChange} type="file" className="hidden" />
      </label>
    </>
  );
}
