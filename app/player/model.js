// model nominal menggunakan mongoose
// untuk collection klo di mongoDB
// dan akan di export ke controller

const mongoose = require('mongoose')

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
    phoneNumber: {
        type: String,
        require: [true, 'phone number harus diisi']
    },
}, { timestamps: true })

module.exports = mongoose.model('Player', playerSchema)