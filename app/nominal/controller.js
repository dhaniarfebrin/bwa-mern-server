const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const data = await Nominal.find();

      res.render("admin/nominal/view_nominal", { data, alert });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req,flash("alertStatus", `danger`);
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req,flash("alertStatus", `danger`);
      res.redirect("/nominal");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;

      const createdData = await Nominal({
        coinQuantity: coinQuantity,
        coinName: coinName,
        price: price,
      });
      await createdData.save();

      req.flash("alertMessage", "Nominal berhasil ditambahkan");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req,flash("alertStatus", `danger`);
      res.redirect("/nominal");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await Nominal.findOne({ _id: id });

      res.render("admin/nominal/edit", { data });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req,flash("alertStatus", `danger`);
      res.redirect("/nominal");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinName, coinQuantity, price } = req.body;

      await Nominal.findOneAndUpdate(
        { _id: id },
        { coinName, coinQuantity, price }
      );

      req.flash("alertMessage", "Nominal berhasil diubah");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req,flash("alertStatus", `danger`);
      res.redirect("/nominal");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Nominal.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Nominal berhasil dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req,flash("alertStatus", `danger`);
      res.redirect("/nominal");
    }
  },
};
