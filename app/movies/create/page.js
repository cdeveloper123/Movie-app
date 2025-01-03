"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toaster, toasterError } from "@/app/auth/components/Toaster";
import Loader from "../../components/Loader";

const MoviesCreate = () => {
  const router = useRouter();

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [poster, setPoster] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [posterError, setPosterError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [publishingYearError, setPublishingYearError] = useState("");
  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
      setPoster(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setFile(e.target.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      toasterError("Please select a valid image file.");
    }
  };

  const validatePoster = () => {
    if (!poster) {
      setPosterError("Poster must not be blank");
      return false;
    }
    return true;
  };

  const validateTitle = () => {
    if (title == "") {
      validatePublishingYear();
      setTitleError("Title must not be blank");
      return false;
    }
    return true;
  };

  const validatePublishingYear = () => {
    if (publishingYear == "") {
      setPublishingYearError("Publishing year must not be blank");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    return validatePoster() && validateTitle() && validatePublishingYear();
  };

  const handleSubmit = async () => {
    try {
      setPosterError("");
      setTitleError("");
      setPublishingYearError("");

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("publishingYear", publishingYear);
      if (poster) formData.append("file", poster);

      const response = await fetch("/api/movies", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toaster("Movie created successfully");
        setLoading(false);
        router.push("/");
      } else {
        setLoading(false);
        toasterError("Failed to create movie");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-64 py-8">
        <div className="flex justify-between flex-wrap my-16">
          <div className="flex items-center">
            <h2 className="text-white text-center text-5xl font-semibold leading-[56px]">
              Create a new movie
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-16 p-0 mb-12">
          <div className="visible sm:hidden xs:block">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="Title"
              placeholder="Title"
              className={`w-full lg:w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            <p className="text-[#EB5757] ml-3 text-sm">{titleError ?? ""}</p>
            <br />
            <input
              type="text"
              value={publishingYear}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setPublishingYear(numericValue);
                setPublishingYearError("");
              }}
              name="Publishing year"
              placeholder="Publishing year"
              className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                publishingYearError
                  ? "border border-[#EB5757] caret-[#EB5757]"
                  : ""
              }`}
              autoComplete="on"
              pattern="\d*"
            />
            <p className="text-[#EB5757] ml-3 text-sm">
              {publishingYearError ?? ""}
            </p>
          </div>

          <div
            className={`w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center justify-center flex-shrink-0 rounded-[10px] border-2 ${
              dragActive ? "border-blue-500" : "border-dashed border-white"
            } bg-[#224957] z-10`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleDivClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
              className={`${
                posterError ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              onChange={(e) => {
                handleFileChange(e.target.files[0]);
                setPoster(e.target.files[0]);
              }}
            />
            <div className="text-center">
              {file ? (
                <Image
                  src={file}
                  width={400}
                  height={350}
                  alt="preview"
                  className="max-w-full max-h-full"
                  style={{ height: "400px" }}
                />
              ) : (
                <>
                  <Image
                    src="/file_download.svg"
                    width={28}
                    height={28}
                    className="inline ml-2 mt-2"
                    alt="add"
                  />
                  <p className="text-white font-normal text-sm leading-6">
                    {dragActive ? "Release to upload" : "Drop an image here"}
                  </p>
                </>
              )}
            </div>
            <p className="text-[#EB5757] ml-3 text-sm">{posterError ?? ""}</p>
          </div>

          <div className="w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center z-10">
            <div className="hidden sm:block sm:mr-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="Title"
                placeholder="Title"
                className={`w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
                }`}
                autoComplete="on"
              />
              <p className="text-[#EB5757] ml-3 text-sm">{titleError ?? ""}</p>
              <br />
              <input
                type="text"
                value={publishingYear}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setPublishingYear(numericValue);
                  setPublishingYearError("");
                }}
                name="Publishing year"
                placeholder="Publishing year"
                className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  publishingYearError ? "border border-red-600" : ""
                }`}
                autoComplete="on"
                pattern="\d*"
              />
              <p className="text-[#EB5757] ml-3 text-sm">
                {publishingYearError ?? ""}
              </p>
            </div>
            <br />
            <div className="flex justify-between space-x-5 lg:space-x-3.5">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="w-[171px] h-14 items-center px-6 py-4 rounded-[10px] border border-white text-white font-bold text-base text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading ? true : false}
                className="w-[171px] h-14 items-center px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center"
              >
                Submit
              </button>
            </div>
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesCreate;
