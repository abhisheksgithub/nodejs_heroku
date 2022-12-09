import Products from "../models/productModel.js";
import { replaceComparisionStrings } from "../utils/commonUtils.js";
import AbstractOptions from "../utils/AbstractOptions.js";
import catchApiErrors from "../utils/catchApiErrors.js";
import AbstractApplicationError from "../utils/AbstractApplicationError.js";

const createProduct = catchApiErrors(async (req, res, next) => {
  const product = await Products.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getProduct = catchApiErrors(async (req, res, next) => {
  let query = Products.find();
  const options = new AbstractOptions(query, req.query);
  options.filter().sort().fieldFilter().pagination();

  const product = await query; // { price: 500, rating: { $gte: 20 }}
  res.status(200).json({
    status: "success",
    results: product.length,
    data: product,
  });
});

const getAggregateProduct = catchApiErrors(async (req, res, next) => {
  const aggregate = await Products.aggregate([
    {
      $match: {
        price: {
          $gt: 40,
          $lte: 50,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        totalPrice: { $sum: "$price" },
        avgRating: { $avg: "$price" },
        count: { $sum: 1 },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $addFields: {
        category: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        category: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  res.status(200).json({
    status: "success",
    results: aggregate.length,
    data: aggregate,
  });
});

const getUniqueIphone = catchApiErrors(async (req, res, next) => {
  let query = Products.findOne();
  const product = await query; // { price: 500, rating: { $gte: 20 }}
  console.log("unique iphone");
  // 404
  if (!product) {
    return next(new AbstractApplicationError("No resourse found!", 404));
  }

  res.status(200).json({
    status: "success",
    results: product?.length,
    data: product,
  });
});

// gt gte lt lte
// name, age
// sort
// filtering out based on fields
// pagination and number of docs in a page // 1M
// aggretion / grouping

// middlewares

const getProductById = catchApiErrors(async (req, res, next) => {
  // console.log(req.query, req.params)
  const product = await Products.findById(req.params.id); // findOne({ _id: value})
  // const product = await Products.findOne(req.params)
  res.status(200).json({
    status: "success",
    results: product.length,
    data: product,
  });
});

const updateProduct = catchApiErrors(async (req, res, next) => {
  // console.log(req.query, req.params)
  const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // const product = await Products.findOne(req.params)
  res.status(200).json({
    status: "success",
    results: product.length,
    data: product,
  });
});

const updateProductAfterFiltering = catchApiErrors(async (req, res, next) => {
  // const product = await Products.findOneAndUpdate(req.query, req.body, {
  //     new: true
  // })
  const product = await Products.updateMany(req.query, req.body, {
    new: true,
  });
  // const product = await Products.findOne(req.params)
  res.status(200).json({
    status: "success",
    results: product.length,
    data: product,
  });
});

const deleteProduct = catchApiErrors(async (req, res, next) => {
  const product = await Products.deleteMany(req.body);
  console.log('Delete product')
  res.status(200).json({
    status: "success",
    data: product,
  });
});

export {
  getProduct,
  createProduct,
  getAggregateProduct,
  getUniqueIphone,
  getProductById,
  updateProduct,
  updateProductAfterFiltering,
  deleteProduct,
};

// { name: 'iPho gte ne 13', price: { 'gte': 40000 }}
