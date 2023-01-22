const mongoose = require('mongoose');

const DonationSchema = mongoose.Schema({
    name: { type: String },
    orgName: { type: String },
    image: { data: Buffer, contentType: String },
    detail: { type: String },
    category: { type: String }
})

module.exports = DonationModel = mongoose.model('DonationModel',DonationSchema)