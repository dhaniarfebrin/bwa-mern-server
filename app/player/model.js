// model nominal menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

// buat encrypt password
const bcrypt = require('bcryptjs')
const HASH_ROUND = 10

// penentuan struktur collection
let playerSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'email harus diisi']
    },
    name: {
        type: String,
        require: [true, 'name harus diisi']
    },
    username: {
        type: String,
        require: [true, 'username harus diisi']
    },
    password: {
        type: String,
        require: [true, 'password harus diisi']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    avatar:  {
        type: String
    },
    fileName: {
        type: String
    },
    phoneNumber: {
        type: String,
        require: [true, 'phone number harus diisi']
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true })

// fungsi validasi jika email sudah terdaftar
playerSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('Player').countDocuments({email: value})
        return !count
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} sudah terdaftar`)

// fungsi ini dieksekusi ketika ada data yang akan di tambahkan ke database
playerSchema.pre('save', function(next) {
    //encrypt password ges
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Player', playerSchema)