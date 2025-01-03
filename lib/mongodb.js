import mongoose from 'mongoose';

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) {
    return; 
  }
  await mongoose.connect('mongodb+srv://cdeveloper2016:hDG79aPFMqeV1jzH@test-movies.4lxan.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectMongo;
