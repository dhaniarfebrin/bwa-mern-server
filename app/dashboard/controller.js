// tempat logic

module.exports =  {
    index: async (req, res) => {
        try {
            // render the view from folder views
            res.render("index")
            // res.render("index", {
            //     name: req.session.user.name,
            //     title: "Dashboard"
            // })
        } catch (err) {
            console.log("there's something went wrong")
        }
    },
}