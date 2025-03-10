// const mongoose = require('mongoose');
// const UserSchema = new mongoose.Schema({
//   teckziteid: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   mobilenumber: {
//     type: Number,
//     required: true
//   },
//   isLogin:{
//     type:Boolean,
//     required:true,
//   },
//   end_timestamp: {
//     type: String,
//   },
//   questions: [{
//     question: {
//       type: String,
//     },
//     answer: {
//       type: String,
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Middleware to Convert Time to IST before saving
// UserSchema.pre('save', function (next) {
//   const istTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
//   this.end_timestamp = istTime;
//   this.createdAt = istTime;
//   this.updatedAt = istTime;
//   next();
// });
// const User = mongoose.model('User', UserSchema);
// module.exports = User;


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  teckziteid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: Number,
    required: true,
  },
  isLogin: {
    type: Boolean,
    default: false, // Default value
  },
  completedtime: {
    type: String,
  },
  end_timestamp: {
    type: String,
  },
  questions: [{
    question: {
      type: String,
      required: true, // Ensure question is provided
    },
    answer: {
      type: String,
      default: "", // Default to an empty string if no answer is provided
    },
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Middleware to set end_timestamp to IST before saving
UserSchema.pre('save', function (next) {
  const istTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  this.end_timestamp = istTime;
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;