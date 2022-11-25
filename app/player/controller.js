const Voucher = require('../voucher/model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const Payment = require('../payment/model')
const Bank = require('../bank/model')
const Transaction = require('../transaction/model')

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
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher , payment, bank } = req.body

      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select('gameName category _id thumbnail user')
        .populate('category').populate('user')
      if (!res_voucher) return res.status(404).json({ message: "voucher game tidak ditemukan." })

      const res_nominal = await Nominal.findOne({_id: nominal})
      if (!res_nominal) return res.status(404).json({ message: "nominal tidak ditemukan." })

      const res_payment = await Payment.findOne({_id: payment}).populate('banks')
      if (!res_payment) return res.status(404).json({ message: "payment tidak ditemukan." })
      
      const res_bank = await Bank.findOne({_id: bank})
      if (!res_bank) return res.status(404).json({ message: "Bank tidak ditemukan." })

      let tax = (10 / 100) * res_nominal._doc.price // set pajak ke 10%
      let value = res_nominal._doc.price + tax // harga final + ppn

      const payload = {
        historyVoucherTopUp: {
          gameName: res_voucher._doc.gameName,
          category: res_voucher._doc.category ? res_voucher._doc.category.name : '',
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bankName: res_bank._doc.nameBank,
          noRekening: res_bank._doc.noRekening
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber
        },
        category: res_voucher._doc.category._id,
        user: res_voucher._doc.user?._id
      }

      const transaction = new Transaction(payload)
      await transaction.save()

      res.status(201).json({data: transaction})

    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  }
}