// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
import mongoose, { Schema } from 'mongoose';

const authSchema = new Schema({
  email: { type: String, lowercase: true },
  Password: { type: String },
  sessionToken: [{
    refreshToken: { type: String, required: true },
    expireAt: { type: Number, required: true }
  }],
  user: { type: Schema.Types.ObjectId, ref: 'User'}
});

const Auth = mongoose.model('auth', authSchema)
module.exports = Auth