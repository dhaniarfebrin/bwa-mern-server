const Bank = require('./model')

module.exports = {
    index: async(req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            const data = await Bank.find();

            res.render("admin/bank/view_bank", { data, alert });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/bank");
        }
    },
    viewCreate: async(req, res) => {
        try {
            res.render('admin/bank/create.ejs')
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/bank");
        }
    },
    actionCreate: async (req, res) => {
        try {
          const { name, nameBank, noRekening } = req.body;
    
          const createdData = await Bank({ name, nameBank, noRekening });
          await createdData.save();
    
          req.flash("alertMessage", "Bank berhasil ditambahkan");
          req.flash("alertStatus", "success");
          res.redirect("/bank");
        } catch (err) {
          req.flash("alertMessage", `${err.message}`);
          req.flash("alertStatus", `danger`);
          res.redirect("/bank");
        }
      },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params

            const data = await Bank.findOne({ _id: id})

            res.render('admin/bank/edit.ejs', {data})
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/bank");
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { name, nameBank, noRekening } = req.body;

            await Bank.findOneAndUpdate({_id: id}, { name, nameBank, noRekening })
            
            req.flash("alertMessage", "Bank berhasil diubah");
            req.flash("alertStatus", "success");
            res.redirect("/bank");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/bank");
        }
    },
    actionDelete: async (req, res) => {
        try {
            const {id} = req.params

            await Bank.findOneAndDelete({_id: id})

            req.flash("alertMessage", "Bank berhasil dihapus");
            req.flash("alertStatus", "success");
            res.redirect("/bank");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", `danger`);
            res.redirect("/bank");
        }
    }
}