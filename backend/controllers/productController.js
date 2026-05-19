import Product from '../models/Product.js';

// @desc    Get all marketplace products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('farmer', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private (Farmer only)
export const createProduct = async (req, res) => {
  const { name, description, price, quantity, unit, category, image } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      quantity,
      unit,
      category,
      image: image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400', // Premium default placeholder image
      farmer: req.user._id,
      farmerName: req.user.name
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private (Farmer owner only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.farmer.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to delete this product' });
      }
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
