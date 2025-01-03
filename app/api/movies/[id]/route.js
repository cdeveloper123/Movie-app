import connectMongo from "@/lib/mongodb";
import Movie from "@/models/Movie";

export async function GET(req, { params }) {

  await connectMongo();
  const param = await params;

  try {
    const movie = await Movie.findById(param.id);
    if (!movie) {
      return new Response(JSON.stringify({ error: "Movie not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(movie), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
