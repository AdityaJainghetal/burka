const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactType: {
    type: String,
    required: true,
  },
  mobile1: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Validate that it's exactly 10 digits
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  mobile2: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Optional, validate if provided
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  whatsapp: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Optional, validate if provided
      },
      message: props => `${props.value} is not a valid WhatsApp number!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required:true
  },
  discount:{
    type:Number,
    required:true
  }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;