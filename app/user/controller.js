const Users = require('./model')
const bcrypt = require('bcryptjs')

module.exports = {
    viewSignin: async (req, res) => {
      try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
  
        if (req.session.user === null || req.session.user === undefined) {
          res.render("admin/user/view_signin", { alert });
        } else {
          res.redirect('/dashboard')
        }

      } catch (err) {
        req.flash("alertMessage", `${err.message}`);
        req.status("alertStatus", `danger`);
        res.redirect("/");
      }
    },
    actionSignIn: async (req, res) => {
      try {
        const { email, password } = req.body
        const user = await Users.findOne({ email: email })

        if (user) {
          if (user.status === 'Y') {
            const checkPassword = await bcrypt.compare(password, user.password)

            if (checkPassword) {

              req.session.user = {
                id: user._id,
                email: user.email,
                status: user.status,
                name: user.name
              }
              res.redirect('/dashboard')
              
            } else {
              req.flash("alertMessage", "Kata sandi salah");
              req.flash("alertStatus", "danger");
              res.redirect("/");
            }

          } else {
            req.flash("alertMessage", "akun anda belum aktif");
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "email yang diinputkan tidak terdaftar");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }

      } catch (error) {
        req.flash("alertMessage", `${err.message}`);
        req.status("alertStatus", `danger`);
        res.redirect("/");
      }
    }
}