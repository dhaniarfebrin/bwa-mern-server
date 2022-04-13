// controller, tempat logic
// akan digunakan oleh router.js
// pengatur model dan view
// menerima model

const Category = require('./model') // import model

module.exports =  {
    index: async (req, res) => {
        try {
            // menerima dan menampilkan alert validasi dari action
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}

            // read collection category
            const data = await Category.find()

            // render the view from folder views dan melemparkan data
            res.render('admin/category/view_category', {
                data,
                alert
            })

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', `danger`)
            res.redirect('/category')
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/category/create')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', `danger`)
            res.redirect('/category')
        }
    },
    // create handle code
    actionCreate: async (req, res) => {
        try {
            const { name } = req.body // mengambil data dari request body POST

            const createdData = await Category({ name: name }) 
            await createdData.save()

            // alert validasi
            req.flash('alertMessage', 'Data berhasil ditambahkan!')
            req.flash('alertStatus', 'success')

            res.redirect('/category') // mengembalikan halaman ke kategori

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', `danger`)
            res.redirect('/category')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params // mengambil data dari request URL

            const data = await Category.findOne({_id: id})

            res.render('admin/category/edit', { data })

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', `danger`)
            res.redirect('/category')
        }
    },
    // edit handle code
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { name } = req.body

            await Category.findOneAndUpdate({_id: id}, {name: name})

            // alert validasi
            req.flash('alertMessage', 'Data berhasil diubah!')
            req.flash('alertStatus', 'success')

            res.redirect('/category')
            
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', `danger`)
            res.redirect('/category')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params

            await Category.findOneAndDelete({_id: id})

            // alert validasi
            req.flash('alertMessage', 'Data berhasil dihapus!')
            req.flash('alertStatus', 'success')

            res.redirect('/category')

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', `danger`)
            res.redirect('/category')
        }
    }
}