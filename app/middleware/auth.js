const config = require("../../config");
const jwt = require('jsonwebtoken')

const Player = require('../player/model')

module.exports = {
    isLoginAdmin: async (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined) {
            req.flash("alertMessage", "Maaf session anda telah habis");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        } else {
            res.locals.user = req.session.user; // middleware to make 'user' available to all templates (keperluan tampilan)
            next()
        }
    },
    isLoginPlayer: async (req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null // ambil token yang aktif dari header

            const data = jwt.verify(token, config.jwtKey) // verify token dengan config-nya

            const player = await Player.findOne({ _id: data.player.id }) // ambil data player sesuai id nya

            if (!player) {
                throw new Error() // kalo ga ada datanya, throw error
            }

            req.player = player // set data player untuk keperluan checkout transaksi
            req.token = token
            next()

        } catch (err) {
            res.status(401).json({
                error: 'no authorized to access this resource'
            })
        }
    }
}