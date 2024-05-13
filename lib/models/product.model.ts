import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: {type: String, required: true, unique: true},
    currency: {type: String, required: true},
    image: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String},
    currentPrice: {type: Number, required: true},
    originalPrice: {type: Number, required: true},
    priceHistory: [
        {
            price: {type: Number, required: true},
            date: {type: Date, default: Date.now}
        }
    ],
    discountRate: {type: Number},
    category: {type: String},
    reviewsCount: {type: Number},
    stars: {type: Number},
    isOutOfStock: {type: Boolean, default: false},
    users: [
        {email: {type: String, required: true}}
    ], default: [],
    lowestPrice: {type: Number},
    highestPrice: {type: Number},
    averagePrice: {type: Number}
}, {timestamps: true});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;