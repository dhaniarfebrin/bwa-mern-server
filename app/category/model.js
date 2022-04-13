// model category menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

// penentuan struktur collection
let categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Nama Kategori harus diisi']
    }
})

module.exports = mongoose.model('Category', categorySchema)