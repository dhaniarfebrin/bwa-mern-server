// model nominal menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

// penentuan struktur collection
let nominalSchema = mongoose.Schema({
    coinQuantity: {
        type: Number,
        default: 0
    },
    coinName: {
        type: String,
        require: [true, 'Nama Coin harus diisi']
    },
    price: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Nominal', nominalSchema)