const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const data = await Transaction.find()

      res.render("admin/transaction/view_transaction", { data, alert });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", `danger`);
      res.redirect("/transaction");
    }
  },
}