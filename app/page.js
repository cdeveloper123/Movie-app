"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import EmptyPosts from "./components/EmptyPosts";
import { signOut } from "next-auth/react";
import nookies from "nookies";
import { useRouter } from "next/navigation";

export default function Home() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const logoutUser = async () => {
    await signOut();
    nookies.destroy(null, "isLoggedIn", { path: "/" });
    await signOut({ callbackUrl: process.env.FRONTEND_URL });
  };

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?page=${page}&limit=10`);
      const data = await res.json();
      setMovies(data);
      setTotalPages(data?.meta?.totalPages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(selectedPage);
  }, [selectedPage]);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white font-bold">Loading movies...</div>
      </div>
    );
  }

  return (
    <>
      {movies?.movies?.items?.length > 0 ? (
        <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
          <div className="flex justify-between flex-wrap my-16">
            <div className="flex items-center">
              <h2 className="text-white text-center text-2xl lg:text-5xl font-semibold leading-[56px]">
                My Movies
              </h2>
              <Image
                src="/add_circle_outline_black.svg"
                width={28}
                height={28}
                className="ml-2 lg:mt-2 cursor-pointer"
                alt="add"
                onClick={() => {
                  router.push("/movies/create");
                }}
              />
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => logoutUser()}
            >
              <h2 className="text-white text-center text-base font-bold mt-0.5 hidden sm:block">
                Logout
              </h2>

              <Image
                src="/logout_back.svg"
                width={28}
                height={28}
                className="ml-2 cursor-pointer"
                alt="logout"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-0 mb-12">
            {movies?.movies?.items?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex cursor-pointer h-[450px] sm:h-[450px] md:h-[450px] lg:h-[615px] p-0 lg:p-2 space-y-4 flex-col items-start flex-shrink-0 rounded-xl bg-[#092C39] hover:bg-[#1E414E] backdrop-filter backdrop-blur-[100px] z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/movies/${item._id}`);
                  }}
                >
                  <div>
                    <Image
                      src={item.poster}
                      alt="post"
                      width={400}
                      height={350}
                      sizes="100vw"
                      priority={true}
                      className="w-[400px]  rounded-t-lg lg:rounded-xl h-[350px] sm:h-[350px] lg:h-[500px]"
                    />
                    <h2 className="py-1 p-2 lg:p-2 lg:py-3 font-medium text-white text-base lg:text-xl leading-8">
                      {item.title}
                    </h2>
                    <p className="text-white font-normal text-sm leading-6 p-2 lg:p-2">
                      {item.publishingYear}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyPosts />
      )}

      {totalPages > 1 && (
        <div className="text-white flex justify-center py-16 z-100 mb-32">
          <div className="flex gap-4">
            {selectedPage > 1 && (
              <button
                onClick={() => setSelectedPage(selectedPage - 1)}
                className="font-mono leading-6 text-base font-bold rounded w-10 h-8"
              >
                Prev
              </button>
            )}
            {pages.map((pageNum, index) => (
              <button
                key={index}
                onClick={() => setSelectedPage(pageNum)}
                aria-current="page"
                className={`bg-[#092C39] font-mono leading-6 text-base font-bold rounded w-8 h-8 ${
                  selectedPage === pageNum && "bg-[#2BD17E] font-mono"
                }`}
              >
                {pageNum}
              </button>
            ))}
            {selectedPage < totalPages && (
              <button
                onClick={() => setSelectedPage(selectedPage + 1)}
                className="font-mono leading-6 text-base font-bold rounded w-8 h-8"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
