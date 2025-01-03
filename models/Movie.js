import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publishingYear: { type: Number, required: true },
  poster: { type: String, required: true },
});

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);
