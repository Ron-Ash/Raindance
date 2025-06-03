"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Skeleton from "./Skeleton";
import { Tooltip } from "@heroui/tooltip";
import { Spinner } from "@heroui/spinner";

export default function SocialPostForm({
  profilePic,
}: {
  profilePic: string | null;
}) {
  const [file, setFile] = useState<File | null>();
  const [message, setMessage] = useState<string | null>();
  const [previewUrl, setPreviewUrl] = useState<string | null>();

  const [anonymous, setAnonymous] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      // Optional: move caret to end
      const len = textAreaRef.current.value.length;
      textAreaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  function handleClear() {
    setFile(null);
    setMessage(null);
    setAnonymous(true);
  }

  async function handlePost() {
    setProcessing(true);
    try {
      const data = new FormData();
      if (file) data.set("file", file);
      if (message) data.set("message", message);
      data.set("isAnonymous", anonymous as unknown as string);
      const res = await fetch("api/postsUploader", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
      handleClear();
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <div className="rounded-3xl border-3 border-stone-700 relative flex flex-col w-[520px] p-2 gap-2">
      <div className="rounded-3xl border-3 border-stone-700 relative flex flex-col w-[500px] h-[350px] p-2 gap-2">
        <div className="flex w-full h-[125px] gap-2">
          <Tooltip
            showArrow
            content={
              anonymous ? "create a signed post" : "create anonymous post"
            }
            closeDelay={200}
            color="primary"
            placement="top-start"
          >
            <button
              className="flex-none rounded-full relative bg-stone-700 w-[50px] h-[50px] overflow-hidden hover:bg-stone-500"
              onClick={() => setAnonymous((anonymous) => !anonymous)}
            >
              {anonymous ? (
                <Skeleton />
              ) : (
                <Image src={profilePic ?? ""} alt="img" fill />
              )}
            </button>
          </Tooltip>
          <Tooltip
            showArrow
            content={message ? "change caption" : "add caption"}
            closeDelay={200}
            color="primary"
            placement="right"
          >
            <div className="rounded-2xl flex-1 flex flex-col">
              {isEditing || message ? (
                <textarea
                  className="w-full h-full bg-transparent rounded-2xl resize-none py-2 px-3"
                  ref={textAreaRef}
                  value={message ?? ""}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                ></textarea>
              ) : (
                <button
                  className="rounded-2xl w-full h-full flex flex-col gap-1 border-3 p-1 border-transparent hover:border-stone-500"
                  onClick={() => setIsEditing(true)}
                >
                  <div className="flex-auto rounded-full relative bg-stone-700 w-full overflow-hidden">
                    <Skeleton />
                  </div>
                  <div className="flex-auto rounded-full relative bg-stone-700 w-full overflow-hidden">
                    <Skeleton />
                  </div>
                  <div className="flex-auto rounded-full relative bg-stone-700 w-full overflow-hidden">
                    <Skeleton />
                  </div>
                </button>
              )}
            </div>
          </Tooltip>
        </div>
        <div className="relative h-full w-full">
          <button
            className="rounded-full absolute top-1 right-1 z-10 w-[15px] h-[15px] flex items-center justify-center bg-black hover:cursor-grab active:cursor-grabbing"
            onClick={() => setFile(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Tooltip
            showArrow
            content={file ? "change attachment" : "add attachment"}
            closeDelay={200}
            color="primary"
            placement="right"
          >
            <div className="rounded-xl relative bg-stone-700 h-full w-full overflow-hidden">
              {file && previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill />
              ) : (
                <Skeleton />
              )}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files?.[0]);
                  }
                }}
              />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="w-full flex gap-4">
        <button
          className="w-full border-2 rounded-2xl text-red-500 border-blue-500 bg-red-500 bg-opacity-0 hover:bg-opacity-100 ease-in-out duration-200 hover:border-red-500 hover:text-white font-bold"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="relative w-full border-2 rounded-2xl text-blue-500 border-blue-500  bg-blue-500 bg-opacity-0 hover:bg-opacity-100 ease-in-out duration-200 hover:border-blue-500 hover:text-white font-bold"
          onClick={handlePost}
        >
          Post
          {processing && (
            <Spinner
              className="absolute right-1 top-0.5 stroke-12"
              size="sm"
              variant="gradient"
              color="default"
            />
          )}
        </button>
      </div>
    </div>
  );
}
