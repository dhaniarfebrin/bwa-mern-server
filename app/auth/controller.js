const Player = require('../player/model')

// tambahan buat upload image
const path = require("path");
const fs = require("fs");
const config = require("../../config");


module.exports = {
    signUp: async (req, res, next) => {
        try {

            const payload =  req.body

            if(req.file) {
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
                    const player = new Player({
                        ...payload,
                        avatar: filename
                    });

                    await player.save();

                    delete player._doc.password

                    res.status(201).json({ data: player })
                } catch (err) {
                    if (err && err.name === 'ValidationError') {
                        return res.status(422).json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err)
                }
                });
            } else {
                let player = new Player(payload)
                await player.save()

                delete player._doc.password

                res.status(201).json({ data: player })
            }

        } catch (err) {
            if (err && err.name === 'ValidationError') {
                return res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
            next(err)
        }
    }
}