import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product Name is mandatory"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Price is a must"],
  },
  discountPercentage: Number,
  rating: Number,
  stock: {
    type: Number,
  },
  category: {
    type: String,
  },
  brand: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  images: [String],
});

// , {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// }

// // Virtual properties
// productSchema.virtual("category").get(function () {
//   if (this.price > 100000) return "Premium";
//   else if (this.price > 30000 && this.price <= 100000) return "Mid range";
//   return "Low range";
// });

// productSchema.virtual("sample").get(function () {
//     return "sample"
// });

// QUERY Middleware
productSchema.pre(/^find/, function (next) {
  // this // query
  console.log("Pre Middleware");
  const data = [
    "iPhone 12",
    "iPhone 13",
    "iPhone 14",
    "iPhone 15",
    "iPhone 17",
    "iPhone 18",
  ];
  const randomNumber = Math.floor(Math.random() * data.length);
  // this.findOne({name: data[randomNumber]})
  next();
});

productSchema.post(/^find/, function (doc, next) {
  console.log("Post Middleware");
  next();
});

// Bag, TV, Computers, Cookie Jar
// color, material, resolution, type, size, flavor

const Products = mongoose.model("Product", productSchema);

export default Products;
