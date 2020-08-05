const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');   // Insertion du pakage mongoose qui permet d'avoir des emails uniques.

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // On ajoute le validateur Mongoose comme Plugin au Schema

module.exports = mongoose.model('User', userSchema);