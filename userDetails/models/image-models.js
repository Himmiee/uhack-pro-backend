const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    name: { type: String, required: true },
    // logo: { data: Buffer, contentType: String },
    category: { type: String },
    tag: { type: String },
    image: { data: Buffer, contentType: String },
    mission: { type: String },
    email: { type: String },
    phonenumber: { type: Number }
})



module.exports = ImageModel = mongoose.model('ImageModel',ImageSchema, 'userDetails')
