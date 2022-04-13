// deklarasi model dari berbagai collections
const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

// tambahan buat upload image
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      // Populate will automatically replace the specified path in the document, with document(s) from other collection(s).
      const data = await Voucher.find()
      .populate('nominals')
      .populate('category') // mengambil data, dan memanipulasi

      res.render("admin/voucher/view_voucher", { data, alert });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.status("alertStatus", `danger`);
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const dataCategory = await Category.find();
      const dataNominal = await Nominal.find();

      res.render("admin/voucher/create", { dataCategory, dataNominal });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.status("alertStatus", `danger`);
      res.redirect("/voucher");
    }
  },
  // action create klo ada file
  actionCreate: async (req, res) => {
    try {
      const { gameName, category, nominals } = req.body;

      // create data if there is a file
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const createdData = new Voucher({
              gameName,
              category,
              nominals,
              thumbnail: filename,
            });

            await createdData.save();

            req.flash("alertMessage", "Voucher berhasil ditambahkan");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.status("alertStatus", `danger`);
            res.redirect("/voucher");
          }
        });
      } else {
        const createdData = new Voucher({
          gameName,
          category,
          nominals,
        });

        await createdData.save();

        req.flash("alertMessage", "Voucher berhasil ditambahkan");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.status("alertStatus", `danger`);
      res.redirect("/voucher");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const dataCategory = await Category.find();
      const dataNominal = await Nominal.find();
      const dataVoucher = await Voucher.findOne({_id: id})
      .populate('nominals')
      .populate('category')

      res.render('admin/voucher/edit', {
        dataCategory,
        dataNominal,
        dataVoucher
      })
      
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.status("alertStatus", `danger`);
      res.redirect("/voucher");
    }
  }
};
