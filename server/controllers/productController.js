import Product from '../models/Product.js';
import mongoose from 'mongoose';
import whatsappService from '../utils/whatsappService.js';

const addIdField = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id };
};

const addIdFieldToArray = (docs) => {
  return docs.map((doc) => addIdField(doc));
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const getAllProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, brand, category, sort, page = 1, limit = 50, includeInactive } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};

    if (!includeInactive) {
      filter.$or = [
        { isActive: { $exists: false } },
        { isActive: true }
      ];
    }
    if (search) {
      filter.$and = (filter.$and || []).concat([
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
          ],
        },
      ]);
    }
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (brand && brand !== 'All') filter.brand = brand;
    if (category && category !== 'All') filter.category = category;

    let sortOption = { createdAt: -1, _id: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products: addIdFieldToArray(products),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const query = {};
    if (mongoose.isValidObjectId(req.params.id)) {
      query.$or = [{ _id: req.params.id }, { slug: req.params.id }];
    } else {
      query.slug = req.params.id;
    }
    let product = await Product.findOne(query);

    if (!product && !mongoose.isValidObjectId(req.params.id)) {
      // Normalize slug to handle aliases like -beard-colour, -beard-color, or brown-black
      const rawId = req.params.id.toLowerCase();
      const cleanSlug = rawId.replace(/-beard-colour$/, '').replace(/-beard-color$/, '');
      const mappedSlug = cleanSlug === 'brown-black' ? 'black-brown' : cleanSlug;

      product = await Product.findOne({
        $or: [
          { slug: mappedSlug },
          { slug: cleanSlug },
          { slug: new RegExp(cleanSlug.replace(/-/g, '.*'), 'i') }
        ]
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json(addIdField(product));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      stock,
      sku,
      brand,
      category,
      image,
      weight,
      length,
      width,
      height,
      hsnCode,
      gstPercentage,
      isActive,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required',
      });
    }

    let finalSlug = slug ? slugify(slug) : slugify(name);
    const existingSlug = await Product.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = new Product({
      name: name.trim(),
      slug: finalSlug,
      description: description || '',
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 0,
      sku: sku || '',
      brand: brand || 'DailyFix',
      category: category || 'Beard Care',
      image: image || '',
      weight: weight ? Number(weight) : 500,
      length: length ? Number(length) : 15,
      width: width ? Number(width) : 10,
      height: height ? Number(height) : 5,
      hsnCode: hsnCode || '',
      gstPercentage: gstPercentage !== undefined ? Number(gstPercentage) : 18,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    await product.save();

    // Trigger WhatsApp notification for admin
    whatsappService.notifyProductAddedAdmin(product).catch((e) => {
      console.log('[WhatsApp] Product alert skipped:', e.message);
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: addIdField(product),
      productId: product._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      stock,
      sku,
      brand,
      category,
      image,
      weight,
      length,
      width,
      height,
      hsnCode,
      gstPercentage,
      isActive,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slugify(slug);
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (sku !== undefined) updateData.sku = sku;
    if (brand !== undefined) updateData.brand = brand;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (weight !== undefined) updateData.weight = Number(weight);
    if (length !== undefined) updateData.length = Number(length);
    if (width !== undefined) updateData.width = Number(width);
    if (height !== undefined) updateData.height = Number(height);
    if (hsnCode !== undefined) updateData.hsnCode = hsnCode;
    if (gstPercentage !== undefined) updateData.gstPercentage = Number(gstPercentage);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: addIdField(updated),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: `Product "${deleted.name}" deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const relativeUrl = `/uploads/products/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'Product image uploaded successfully',
      imageUrl: relativeUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
