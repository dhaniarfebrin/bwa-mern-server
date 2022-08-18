// tempat logic

module.exports =  {
    index: async (req, res) => {
        try {
            // render the view from folder views
            res.render("index")
        } catch (err) {
            console.log("there's something went wrong")
        }
    },
}