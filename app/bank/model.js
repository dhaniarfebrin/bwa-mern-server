// model nominal menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

// penentuan struktur collection
let bankSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Nama pemilik harus diisi']
    },
    nameBank: {
        type: String,
        require: [true, 'Nama bank harus diisi']
    },
    noRekening: {
        type: String,
        require: [true, 'Nomor rekening bank tidak boleh kosong']
    }
}, { timestamps: true })

module.exports = mongoose.model('Bank', bankSchema)