const Voucher = require('../voucher/model')

module.exports = {
  landingPage: async (req, res) => {
    try {

        const voucher = await Voucher.find()
            .select('_id status category thumbnail gameName')
            .populate('category')

        res.status(200).json({ data: voucher })

    } catch (err) {
        res.status(500).json({message: err.message || `Terjadi kesalahan di sisi server`})
    }
  },
}