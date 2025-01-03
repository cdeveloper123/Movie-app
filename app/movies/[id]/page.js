"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { toaster, toasterError } from "@/app/auth/components/Toaster";

export default function MovieEditor() {
  const router = useRouter();
  const pathname = usePathname();
  const movieId = pathname.replace(/^\/movies\//, "");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [poster, setPoster] = useState(null);

  const [posterError, setPosterError] = useState("");
  const [title, setTitle] = useState(movie?.title ?? "");
  const [publishingYear, setPublishingYear] = useState(
    movie?.publishingYear ?? ""
  );
  const [titleError, setTitleError] = useState("");
  const [publishingYearError, setPublishingYearError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (movieId) {
      const fetchMovie = async () => {
        const res = await fetch(`/api/movies/${movieId}`);
        if (res.ok) {
          const data = await res.json();
          setMovie(data);
          setTitle(data.title);
          setPublishingYear(data?.publishingYear);
          setLoading(false);
        } else {
          console.error("Failed to fetch movie data");
        }
      };

      fetchMovie();
    }
  }, [movieId]);

  useEffect(() => {
    setTitle(movie?.title);
    setPublishingYear(movie?.publishingYear);
  }, [movie]);

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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
      setPoster(selectedFile);
    } else {
      setPosterError("Please select a valid image file.");
    }
  };

  const validatePoster = () => {
    if (!poster && !movie.poster) {
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

      const movie = {
        title: title,
        publishingYear: publishingYear,
      };

      if (poster) {
        movie.poster = poster;
      }

      const formData = new FormData();
      formData.append("id", movieId);
      formData.append("title", title);
      formData.append("publishingYear", publishingYear);
      if (poster) formData.append("file", poster);

      const response = await fetch("/api/movies", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toaster("Movie Edited successfully!");
      } else {
        toasterError("Failed to edit movie");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-64 py-8">
        <div className="flex justify-between flex-wrap my-16">
          <div className="flex items-center">
            <h2 className="text-white text-center text-5xl font-semibold leading-[56px]">
              Edit
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-16 p-0 mb-12">
          <div className="visible sm:hidden xs:block">
            <input
              value={movie?.title || ""}
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              name="Title"
              placeholder="Title"
              className={`w-full lg:w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            <p className="text-[#EB5757] text-sm">{titleError ?? ""}</p>
            <br />
            <input
              value={publishingYear || ""}
              type="number"
              onChange={(e) => {
                setPublishingYear(e.target.value);
              }}
              name="Publishing year"
              placeholder="Publishing year"
              className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                publishingYearError
                  ? "border border-[#EB5757] caret-[#EB5757]"
                  : ""
              }`}
              autoComplete="on"
            />
            <p className="text-[#EB5757] text-sm">
              {publishingYearError ?? ""}
            </p>
          </div>

          <div
            className="w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center justify-center flex-shrink-0 rounded-[10px] border-2 border-dashed border-white bg-[#224957] z-10"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleDivClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                handleFileChange(e.target.files[0]);
                setPoster(e.target.files[0]);
              }}
              className={`${posterError ? "border border-[#EB5757]" : ""}`}
            />
            <div className="text-center">
              {file || movie?.poster ? (
                <Image
                  src={file || movie.poster}
                  width={400}
                  height={350}
                  alt="preview"
                  className="max-w-full max-h-full"
                  style={{ height: "400px" }}
                  priority={true}
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
                    {file ? "Image uploaded!" : "Drop other image here"}
                  </p>
                </>
              )}
            </div>
            <p className="text-[#EB5757] text-sm">{posterError ?? ""}</p>
          </div>

          <div className="w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center z-10">
            <div className="hidden sm:block sm:mr-2">
              <input
                value={title || ""}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                name="Title"
                placeholder="Title"
                className={`w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
                }`}
                autoComplete="on"
              />
              <p className="text-[#EB5757] text-sm">{titleError ?? ""}</p>
              <br />
              <input
                value={publishingYear || ""}
                type="number"
                onChange={(e) => {
                  setPublishingYear(e.target.value);
                }}
                name="Publishing year"
                placeholder="Publishing year"
                className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  publishingYearError
                    ? "border border-[#EB5757] caret-[#EB5757]"
                    : ""
                }`}
              />
              <p className="text-[#EB5757] text-sm">
                {publishingYearError ?? ""}
              </p>
            </div>
            <br />
            <div className="flex sm:w-[80%] flex-col sm:flex-row justify-between sm:space-x-5 space-y-4 sm:space-y-0 lg:space-x-3.5 mx-auto">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="w-full sm:w-[250px] h-14 px-6 py-4 rounded-[10px] border border-white text-white font-bold text-base text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-[250px] h-14 px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
