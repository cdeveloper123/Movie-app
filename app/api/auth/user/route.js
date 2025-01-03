import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  const { email } = await req.json();

  await connectMongo();

  try {
    const existingUser = await User.findOne({email});

    return new Response(JSON.stringify(existingUser._id), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
