// model voucher menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

// penentuan struktur collection
let voucherSchema = mongoose.Schema({
    gameName: {
        type: String,
        require: [true, 'Nama Game harus diisi']
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    thumbnail: {
        type: String
    },
    // relasi ke collection lain
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    nominals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nominal'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Voucher', voucherSchema)