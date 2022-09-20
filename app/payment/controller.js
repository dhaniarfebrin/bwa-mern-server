const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const data = await Payment.find().populate('banks');

      res.render("admin/payment/view_payment", { data, alert });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
        const banks = await Bank.find();
        res.render("admin/payment/create", {banks});
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;

      const createdData = await Payment({
        type,
        banks
      });
      await createdData.save();

      req.flash("alertMessage", "Jenis pembayaran berhasil ditambahkan");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const dataPayment = await Payment.findOne({ _id: id }).populate('banks');
      const dataBank = await Bank.find();

      res.render("admin/payment/edit", { dataPayment, dataBank });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, banks } = req.body;

      await Payment.findOneAndUpdate(
        { _id: id },
        { type, banks }
      );

      req.flash("alertMessage", "Payment berhasil diubah");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Payment.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Payment berhasil dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params

      const payment = await Payment.findOne({_id: id})
      let status = payment.flash === 'Y' ? 'N' : 'Y'
      
      await Payment.findOneAndUpdate({_id: id}, {status})

      if(status === 'Y') {
        req.flash("alertMessage", "Payment berhasil diaktifkan");
      } else {
        req.flash("alertMessage", "Payment berhasil dinonaktifkan");
      }
      req.flash("alertStatus", "success")
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/payment");
    }
  }
};
