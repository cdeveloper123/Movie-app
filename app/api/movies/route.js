import connectMongo from "@/lib/mongodb";
import Movie from "@/models/Movie";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  await connectMongo();

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = body.file || null;

  if (file) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const readableStream = Readable.from(buffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "movie-posters",
            public_id: uuidv4(),
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        readableStream.pipe(uploadStream);
      });

      const posterUrl = uploadResponse.secure_url;
      const movieData = {
        ...body,
        posterUrl,
      };

      const { title, publishingYear } = movieData;

      const movie = await Movie.create({
        title,
        publishingYear,
        poster: posterUrl,
      });

      return new Response(JSON.stringify({ success: true, movie }), {
        status: 201,
      });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return new Response(JSON.stringify({ error: "Failed to upload image" }), {
        status: 500,
      });
    }
  } else {
    return new Response(
      JSON.stringify({ success: false, error: "No file uploaded" }),
      { status: 400 }
    );
  }
};

export async function GET(req) {
  await connectMongo();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 12;

  try {
    const skip = (page - 1) * limit;

    const movies = await Movie.find().skip(skip).limit(limit);

    const totalMovies = await Movie.countDocuments();

    const totalPages = Math.ceil(totalMovies / limit);

    const response = {
      movies: {
        items: movies,
      },
      meta: {
        page,
        limit,
        totalMovies,
        totalPages,
      },
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch movies" }), {
      status: 500,
    });
  }
}

export const PUT = async (req) => {
  await connectMongo();

  const formData = await req.formData();
  const body = Object.fromEntries(formData);

  const { id, ...data } = body;
  const file = body.file || null;

  if (file) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "movie-posters",
            public_id: uuidv4(), 
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        const readableStream = Readable.from(buffer);
        readableStream.pipe(uploadStream);
      });

      data.poster = uploadResponse.secure_url;

      const updatedMovie = await Movie.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updatedMovie) {
        return new Response(JSON.stringify({ error: "Movie not found" }), {
          status: 404,
        });
      }

      return new Response(
        JSON.stringify({ success: true, movie: updatedMovie }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating movie:", error);
      return new Response(JSON.stringify({ error: "Failed to update movie" }), {
        status: 500,
      });
    }
  } else {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updatedMovie) {
        return new Response(JSON.stringify({ error: "Movie not found" }), {
          status: 404,
        });
      }

      return new Response(
        JSON.stringify({ success: true, movie: updatedMovie }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating movie:", error);
      return new Response(JSON.stringify({ error: "Failed to update movie" }), {
        status: 500,
      });
    }
  }
};

export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  try {
    await Movie.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({ message: "Movie deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete movie" }), {
      status: 400,
    });
  }
}
