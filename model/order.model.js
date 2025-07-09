import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  OrderID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  date :{
    type: Date,
    required: true,
    default: Date.now
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  phoneNo: {
    type: String,
    required: true,
  },
  billItem: {
    type: [
        {
            productID : String,
            productName : String,
            image : String,
            price : Number,
            quantity : Number

        }],
       
    required : true
  },
  total: {
    type : Number,
    required: true
  }

});

const Order = mongoose.model('order',orderSchema);

export default Order