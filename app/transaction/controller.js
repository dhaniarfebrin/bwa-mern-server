const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const data = await Transaction.find().populate('player')

      res.render("admin/transaction/view_transaction", { data, alert });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/transaction");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params
      const { status } = req.query

      await Transaction.findOneAndUpdate({_id: id}, {status})

      req.flash("alertMessage", `Berhasil merubah status`);
      req.flash("alertStatus", `success`);
      res.redirect("/transaction");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/transaction");
    }
  }
}