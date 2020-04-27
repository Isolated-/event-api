import { Schema } from 'mongoose';

/**
 *  @note some basic validation is performed with Mongoose
 *  This provides an additional layer before persistence
 *  Although it's not strictly required providing tests pass.
 */
export const HookSchema: Schema = new Schema({
  // don't confuse with _id or id from MongoDB
  hookId: {
    type: String,
    unique: true,
    required: true,
  },

  name: {
    type: String,
    required: false,
    minlength: 5,
  },

  event: {
    type: Array,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  secret: {
    type: String,
    required: false,
  },

  rotate: {
    type: Boolean,
    required: false,
  },
});
