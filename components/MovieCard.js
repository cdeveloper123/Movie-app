export default function MovieCard({ movie }) {
    return (
      <div className="border p-4 rounded shadow-sm">
        <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover mb-2" />
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <p className="text-gray-600">{movie.publishingYear}</p>
      </div>
    );
  }
  