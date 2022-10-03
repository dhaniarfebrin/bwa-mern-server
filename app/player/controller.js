const Voucher = require('../voucher/model')
const Category = require('../category/model')

module.exports = {
  landingPage: async (req, res) => {
    try {
        const voucher = await Voucher.find()
            .select('_id status category thumbnail gameName')
            .populate('category')

        res.status(200).json({ data: voucher })

    } catch (err) {
        res.status(500).json({message: err.message || `Internal server error`})
    }
  },
  detailPage: async (req, res) => {
    try {
        const { id } = req.params
        const voucher = await Voucher.findOne({ _id: id })
          .populate('nominals')
          .populate('category')
          .populate('user', '_id name phoneNumber')
        
        if (!voucher) {
          return res.status(404).json({ message: "voucher tidak ditemukan" })
        }

        res.status(200).json({ data: voucher })
    } catch (err) {
        res.status(500).json({message: err.message || `Internal server error`})
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find()

      res.status(200).json({ data: category })
    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  }
}