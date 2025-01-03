"use client";

import { useRouter } from "next/navigation";

const EmptyPosts = () => {
  const router = useRouter();

  return (
    <>
      <div
        id="blogs"
        className="flex flex-col h-screen items-center justify-center"
      >
        <h2 className="text-white text-center text-5xl font-semibold leading-[56px] mb-10">
          Your movie list is empty
        </h2>
        <button
          onClick={() => {
            router.push("/movies/create");
          }}
          className="inline-flex items-start gap-[5px] px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base"
        >
          Add a new movie
        </button>
      </div>
    </>
  );
};

export default EmptyPosts;
