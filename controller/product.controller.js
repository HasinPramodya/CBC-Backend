import Product from "../model/product.model.js";


export async function createProduct(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "You need to Login first",
    });
    return;
  }

  if (req.user.userType !== "admin") {
    res.status(403).json({
      message: "You need to Login as a Admin",
    });
    return;
  }

  try {
    const product = new Product(req.body);
    console.log(product)
    await product.save();
    res.status(201).json({
      message: "Product Created Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Product Can Not Created",
    });
  }
}

export async function getAllProducts(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "You need to Login first",
    });
    return;
  }
  try {
    const products = await Product.find();
    res.status(200).json({
      products,
    });
  } catch (err) {
    res.status(500).json({
      message: "Can not get all products",
    });
  }
}

export async function searchProduct(req, res) {
  const search = req.params.id;
  if (req.user == null) {
    res.json({
      message: "You need to Login first",
    });
    return;
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { altNames: { $elemMatch: { $regex: search, $options: "i" } } },
      ],
    });
    res.json({
      products: products,
    });
  } catch (err) {
    res.json({
      message: "Can not find the product",
    });
  }
  return;
}

export async function deleteProduct(req, res) {
  if (req.user == null) {
    res.json({
      message: "You need to Login first",
    });
    return;
  }

  if(req.user.userType !== "admin"){
       res.json({
        message : "You need to Login as a Admin",
       })
  }

  try {
    await Product.findOneAndDelete({
      productId: req.params.id,
    });
    res.json({
      message: "Product Deleted Successsfully",
    });
  } catch (err) {
    res.json({
      message: "Product Can not Deleted",
    });
  }
}

export async function updateProduct(req, res) {
  if (req.user == null) {
    res.json({
      message: "You need to Login first",
    });
    return;
  }

  if(req.user.userType !== "admin"){
    res.json({
      message: "You need to Login as a Admin",
    });
    return;
  }
try{
 await  Product.findOneAndUpdate({
    productId : req.params.id
  },req.body)
  res.json({
      message: "Product  Updated Successfully",
    });
}catch(err){
  res.json({
      message: "Product Can not Updated",
    });
}
}






 
