import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true,
        default: 0
    },
    Image: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;