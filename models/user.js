const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    body:{ type: String, required:false},
    status:{ type: Number , required:true},
    type:{type:String,required: true},
    userStatus:{type:String,required: true},
    image_id:{type:String,required:false}
  },{timestamps: { createdAt: true, updatedAt: false }});
  
  const User = mongoose.model("user", userSchema);
  
  module.exports = User;
  