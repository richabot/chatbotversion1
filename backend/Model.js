const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  chatbotId: { type: String, required: true },
  name: { type: String, required: true },
  headerColor: { type: String, required: true },
  headerBackColor: { type: String },
  bubbleColor: { type: String },
  heading: { type: String },
  startmessage: { type: String },
  botfontcolor: { type: String },
});

const userCustomizationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  chatbots: [chatbotSchema],
});

const UserCustomization = mongoose.model('UserCustomization', userCustomizationSchema);

module.exports = UserCustomization;