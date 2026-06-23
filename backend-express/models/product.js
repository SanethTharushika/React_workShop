 import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
       productId : {
            type : String,
            unique : true,
            required : true
       },
       name : {
            type : String,
            required : true
       },
       altNames : {
            type : [String],
            default : [],
            required : true
       },
         description : {
            type : String,
            required : true
       },
         price : {
            type : Number,
            required : true
       },
       labelledPrice : {
            type : Number,
            required : true
       },
         image : {
            type : [String],
            default : ["/default-product-1.png", "/default-product-2.png"],
            required : true
       },
       isAvailable : {
            type : Boolean,
            default : true,
            required : true
       },
       category : {
            type : String,
            required : true
       },
         stock : {
            type : Number,
            default : 0,
            required : true
       },
       brand : {
            type : String,
            required : false
       },
       model : {
            type : String,
            required : false
       }    

    }
)

const Product = mongoose.model("Product", productSchema);

export default Product;