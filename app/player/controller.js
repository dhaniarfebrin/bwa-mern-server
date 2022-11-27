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
      const { accountUser, name, nominal, voucher , payment, bank } = req.body // mengambil data dari req.body

      console.log(req.player);

      const res_voucher = await Voucher.findOne({ _id: voucher }) // mengambil data voucher sesuai req dari body
        .select('gameName category _id thumbnail user') // memilih field apa saja yang ingin diambil
        .populate('category').populate('user') // menimpa dokumen yang reference sesuai dengan data aslinya
      if (!res_voucher) return res.status(404).json({ message: "voucher game tidak ditemukan." }) // validasi jika data tidak ada

      const res_nominal = await Nominal.findOne({_id: nominal}) // mengambil data nominal sesuai req body
      if (!res_nominal) return res.status(404).json({ message: "nominal tidak ditemukan." }) // validasi jika data tidak ada

      const res_payment = await Payment.findOne({_id: payment}).populate('banks') // mengambil data payment sesuai req body
      if (!res_payment) return res.status(404).json({ message: "payment tidak ditemukan." }) // validasi jika data tidak ada
      
      const res_bank = await Bank.findOne({_id: bank}) // mengambil data bank sesuai req dari body
      if (!res_bank) return res.status(404).json({ message: "Bank tidak ditemukan." }) // validasi jika data tidak ada

      let tax = (10 / 100) * res_nominal._doc.price // set pajak ke 10%
      let value = res_nominal._doc.price + tax // harga final + pajak

      const payload = { // membuat data untuk transaksi
        historyVoucherTopUp: {
          gameName: res_voucher._doc.gameName,
          category: res_voucher._doc.category ? res_voucher._doc.category.name : "",
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

      const transaction = new Transaction(payload) // membuat schema baru untuk data transaksi
      await transaction.save() // menyimpan data ke collection transaksi

      res.status(201).json({data: transaction}) // mengirim respon data yang sudah tersimpan ke client

    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  },
  historyTransaction: async (req, res) => {
    try {
      // kita akan mengambil data transaksi dan ada filter sesuai statusnya, dan juga kita membuat total uang yang dihabiskan untuk membeli voucher di setiap transaksinya

      const { status = '' } = req.query // menangkap inputan dari query url untuk status filternya

      let criteria = {} // deklarasi criteria untuk memanggil transaksi sesuai dengan kriteria
      // kenapa kosong? untuk bisa ditambah - tambah datanya dengan dinamis

      if (status.length) { // jika ada req status nya
        criteria = { // mendeklarasikan ulang criteria
          ...criteria, // memasukkan value (isi) dari criteria yang sebelumnya
          status: { $regex: `${status}`, $options: 'i' } // ya menambahkan status sebagai kriteria untuk pemanggilan data
        }
      }

      if(req.player._id) { // jika ada user login
        criteria = { // mendeklarasikan ulang criteria
          ...criteria, // memasukkan value (isi) dari criteria yang sebelumnya
          player: req.player._id // menambahkan object player sebagai criteria
        } // req.player di dapat dari hasil decode token user yang login dari middleware
      }

      const historyTransaction = await Transaction.find(criteria) // memanggil data transaksi sesuai criteria yang sudah dideklarasikan

      let totalValue = await Transaction.aggregate([ // ini mau membuat data total uang yang dihabiskan berdasarkan id player yang sama
        {$match: criteria}, // mengambil data uang sesuai kriteria
        {
          $group: {
            _id: null,
            value: {$sum: "$value"} // menjumlahkan total uang yang dihabiskan player dalam membeli voucher
          }
        }
      ])

      res.status(200).json({ 
        data: historyTransaction, // data transaksi sesuai statusnya
        total: totalValue.length ? totalValue[0].value : 0 // jumlah yang dihabiskan sesuai berapa banyak transaksinya
      })

    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  },
  historyTransactionDetail: async (req, res) => { // menampilkan history detail berdasarkan id nya
    try {
      const { id } = req.params

      const historyTransaction = await Transaction.findOne({ _id: id })

      if (!historyTransaction) return res.status(404).json({ message: "history tidak ditemukan" })

      res.status(200).json({ data: historyTransaction })
    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([ // mengelompokkan sesuai kategori dan menjumlahkan semua uang yang dihabiskan dari transaksi per kategori yang sama
        {$match: {player: req.player._id}}, // mengambil data transaksi sesuai id player
        {
          $group: {
            _id: '$category', // mengelompokkan category yang sama jadi satu
            value: {$sum: '$value'} // menjumlahkan semua total uang yang dihabiskan berdasarkan kelompok kategori yang sama
          }
        }
      ])

      const category = await Category.find()

      category.forEach(element => {
        count.forEach(data => {
          if (data._id.toString() === element._id.toString()) { // jika transaksi mempunyai kategori yang sama dari daftar kategori maka
            data.name = element.name // menambah field nama kategori di dalam data count
          }
        })
      })

      // mengambil semua data riwayat transaksi dari player, lalu mengurutkannya berdasarkan updatedAt Descending
      const history = await Transaction.find({ player: req.player._id }).populate('category').sort({'updatedAt': -1})

      res.status(200).json({ data: history, count: count })
    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  },
  profile: async (req, res) => {
    try {

      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber
      }
      
      res.status(200).json({ data: player })

    } catch (err) {
      res.status(500).json({message: err.message || `Internal server error`})
    }
  }
}