import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }, // in kg, units, etc.
  unit: { type: String, default: 'kg' },
  category: { type: String, enum: ['fruits', 'vegetables', 'grains', 'organic'], required: true },
  image: { type: String, default: '' },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  ratings: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 12 }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
