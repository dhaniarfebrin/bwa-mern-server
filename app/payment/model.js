// model nominal menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

// penentuan struktur collection
let paymentSchema = mongoose.Schema({
    type: {
        type: String,
        require: [true, 'tipe pembayaran harus diisi']
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    banks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank'
    }]
})

module.exports = mongoose.model('Payment', paymentSchema)