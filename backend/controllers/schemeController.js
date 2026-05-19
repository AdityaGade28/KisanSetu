import Scheme from '../models/Scheme.js';

// Seed default schemes helper function
const seedDefaultSchemes = async () => {
  const count = await Scheme.countDocuments();
  if (count === 0) {
    await Scheme.insertMany([
      {
        title: 'PM-Kisan Samman Nidhi / पीएम-किसान सम्मान निधि',
        ministry: 'Ministry of Agriculture & Farmers Welfare / कृषि और किसान कल्याण मंत्रालय',
        benefit: '₹6,000 per year in 3 equal installments / प्रति वर्ष ₹6,000 तीन समान किस्तों में',
        eligibility: 'All landholding farmer families across the country / देश के सभी भूमिधारक किसान परिवार',
        documents: ['Aadhaar Card', 'Land Holding Documents', 'Bank Account Details', 'Mobile Number'],
        description: 'A central sector scheme that provides income support to all landholding farmers families to help them procure various inputs related to agriculture.'
      },
      {
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) / फसल बीमा योजना',
        ministry: 'Ministry of Agriculture & Farmers Welfare / कृषि और किसान कल्याण मंत्रालय',
        benefit: 'Comprehensive crop insurance covering risk / व्यापक फसल बीमा सुरक्षा',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops',
        documents: ['Land Records', 'Sowing Certificate', 'Bank Passbook', 'Aadhaar Card'],
        description: 'Integrates crop insurance with technology to provide financial cover against crop loss due to natural calamities, pests, and diseases.'
      },
      {
        title: 'PM Krishi Sinchayee Yojana (PMKSY) / कृषि सिंचाई योजना',
        ministry: 'Ministry of Jal Shakti / Ministry of Agriculture',
        benefit: 'Up to 55% subsidy on micro-irrigation systems / सूक्ष्म सिंचाई प्रणालियों पर 55% तक सब्सिडी',
        eligibility: 'All farmers owning agricultural land. Cooperative societies members can also apply.',
        documents: ['Land Registration Copy', 'Soil Testing Report', 'Subsidy Form', 'Aadhaar Card'],
        description: 'Focuses on improving water-use efficiency "More Crop Per Drop" through micro-irrigation technologies.'
      }
    ]);
  }
};

// @desc    Get all Government Schemes
// @route   GET /api/schemes
// @access  Public
export const getSchemes = async (req, res) => {
  try {
    await seedDefaultSchemes();
    const schemes = await Scheme.find({});
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve government schemes' });
  }
};

// @desc    Create a new Government Scheme
// @route   POST /api/schemes
// @access  Private/Admin
export const createScheme = async (req, res) => {
  const { title, ministry, benefit, eligibility, documents, description } = req.body;

  try {
    const scheme = await Scheme.create({
      title,
      ministry,
      benefit,
      eligibility,
      documents: Array.isArray(documents) ? documents : documents.split(',').map(d => d.trim()),
      description
    });
    res.status(201).json(scheme);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid scheme data' });
  }
};

// @desc    Delete a Government Scheme
// @route   DELETE /api/schemes/:id
// @access  Private/Admin
export const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (scheme) {
      await scheme.deleteOne();
      res.json({ message: 'Welfare scheme deleted successfully' });
    } else {
      res.status(404).json({ message: 'Scheme not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete scheme' });
  }
};

// @desc    Apply for a Government Scheme
// @route   POST /api/schemes/:id/apply
// @access  Private
export const applyForScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    // Check if already applied
    if (scheme.appliedFarmers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already applied for this scheme' });
    }

    scheme.appliedFarmers.push(req.user._id);
    await scheme.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply for scheme' });
  }
};
