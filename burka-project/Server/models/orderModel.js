
const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required:true
    },
    shippingInfo:{
      firstName:{
        type:String,
     
      },
      lastName:{
        type:String,
        required:true,  
      },
      address:{
        type:String,
        required:true,  
      },
      city:{
        type:String,
        required:true,  
      },
      state:{
        type:String,
        required:true,  
      },
      other:{
        type:String,
        required:true,  
      },
      pincode:{
        type:Number,
        required:true,  
      }
    },
    paymentInfo:{
      razorpayOrderId:{
        type:String,
        required:true
      },
      razorpayPaymentId:{
        type:String,
        required:true,  
      }
    },
    orderItems:[{
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
       
      },
      color:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Color',
        
      },
      quantity:{
        type:Number,
        required:true
      },
      price:{
        type:Number,
        required:true
      }
    }],
    paidAt:{
      type:Date,
      default:Date.now()
    },
    month:{
      type:String,
      default:new Date().month
    },
    totalPrice:{
      type:Number,
      required:true
    },
    totalPriceAfterDiscount:{
      type:Number,
      required:true
    },
    orderStatus:{
      type:String,
      default:'Ordered'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
