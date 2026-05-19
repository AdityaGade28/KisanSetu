import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  state: { type: String },
  district: { type: String },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  profileImage: { type: String, default: '' },
  aadhar: { type: String, default: '' },
  address: { type: String, default: '' },
  pinCode: { type: String, default: '' },
  farmId: { type: String, default: 'KS-FARM-98124' },
  farmSize: { type: String, default: '5.5 Hectares' },
  currentCrop: { type: String, default: 'Onion, Wheat, Grapes' },
  farmLocation: { type: String, default: 'Village Pimpri, Taluka Daund, Dist. Pune' }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
