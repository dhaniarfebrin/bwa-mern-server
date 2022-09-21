const Transaction = require('../transaction/model')
const Voucher = require('../voucher/model')
const Player = require('../player/model')
const Category = require('../category/model')

// tempat logic
module.exports =  {
    index: async (req, res) => {
        try {
            // render the view from folder views
            
            const transaction = await Transaction.countDocuments()
            const voucher = await Voucher.countDocuments()
            const player = await Player.countDocuments()
            const category = await Category.countDocuments()
            
            res.render("admin/dashboard/view_dashboard", { count: {
                transaction,
                voucher,
                player,
                category
            }})

        } catch (err) {
            console.log("there's something went wrong")
        }
    },
}