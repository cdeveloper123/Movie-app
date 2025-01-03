import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.createUser = async function ({ username, password, name, email }) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new this({ username, password: hashedPassword, name, email });
  await user.save();
  return user;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
