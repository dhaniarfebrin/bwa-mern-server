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
      req.status("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
        const banks = await Bank.find();
        res.render("admin/payment/create", {banks});
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.status("alertStatus", `danger`);
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
      req.status("alertStatus", `danger`);
      res.redirect("/payment");
    }
  },
//   viewEdit: async (req, res) => {
//     try {
//       const { id } = req.params;

//       const data = await Nominal.findOne({ _id: id });

//       res.render("admin/nominal/edit", { data });
//     } catch (err) {
//       req.flash("alertMessage", `${err.message}`);
//       req.status("alertStatus", `danger`);
//       res.redirect("/nominal");
//     }
//   },
//   actionEdit: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { coinName, coinQuantity, price } = req.body;

//       await Nominal.findOneAndUpdate(
//         { _id: id },
//         { coinName, coinQuantity, price }
//       );

//       req.flash("alertMessage", "Nominal berhasil diubah");
//       req.flash("alertStatus", "success");
//       res.redirect("/nominal");
//     } catch (err) {
//       req.flash("alertMessage", `${err.message}`);
//       req.status("alertStatus", `danger`);
//       res.redirect("/nominal");
//     }
//   },
//   actionDelete: async (req, res) => {
//     try {
//       const { id } = req.params;

//       await Nominal.findOneAndDelete({ _id: id });

//       req.flash("alertMessage", "Nominal berhasil dihapus");
//       req.flash("alertStatus", "success");
//       res.redirect("/nominal");
//     } catch (err) {
//       req.flash("alertMessage", `${err.message}`);
//       req.status("alertStatus", `danger`);
//       res.redirect("/nominal");
//     }
//   },
};
