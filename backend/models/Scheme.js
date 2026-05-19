import mongoose from 'mongoose';

const schemeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ministry: {
    type: String,
    required: true
  },
  benefit: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  documents: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  appliedFarmers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
