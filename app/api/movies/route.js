import connectMongo from "@/lib/mongodb";
import Movie from "@/models/Movie";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req) => {
  await connectMongo();

  const formData = await req.formData();

  const body = Object.fromEntries(formData);
  const file = body.file || null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const uniqueName = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.resolve(UPLOAD_DIR, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const movieData = {
      ...body,
      posterUrl: `/uploads/${uniqueName}`,
    };

    try {
      const {
        title,
        publishingYear,
        file: { name: poster },
      } = movieData;

      const movie = await Movie.create({
        title,
        publishingYear,
        poster: uniqueName,
      });

      return new Response(JSON.stringify({ success: true, movie }), {
        status: 201,
      });
    } catch (error) {
      console.error("Error creating movie:", error);
      return new Response(JSON.stringify({ error: "Failed to create movie" }), {
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

    const movies = await Movie.find()
      .skip(skip)
      .limit(limit);

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

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const uniqueName = `${uuidv4()}${path.extname(file.name)}`;
      const filePath = path.resolve(UPLOAD_DIR, uniqueName);

      fs.writeFileSync(filePath, buffer);

      data.poster = uniqueName;

      const updatedMovie = await Movie.findByIdAndUpdate(id, data, { new: true });

      if (!updatedMovie) {
        return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, movie: updatedMovie }), { status: 200 });
    } catch (error) {
      console.error("Error updating movie:", error);
      return new Response(JSON.stringify({ error: 'Failed to update movie' }), { status: 500 });
    }
  } else {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(id, data, { new: true });

      if (!updatedMovie) {
        return new Response(JSON.stringify({ error: 'Movie not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, movie: updatedMovie }), { status: 200 });
    } catch (error) {
      console.error("Error updating movie:", error);
      return new Response(JSON.stringify({ error: 'Failed to update movie' }), { status: 500 });
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
