module.exports = {
    uploadSingleImage: async (req, res) => {
        const image = req.file.location;
        console.log(req.file);
        console.log(req.body);
        res.send({
            imageUrl: image,
            file: req.file,
            body: req.body
        });
    },
    uploadMultiImages: async (req, res) => {
        const imageUrls = req.files.map(file => file.location);
        console.log(req.files);
        console.log(req.body);
        res.send({
            imageUrls: imageUrls,
            file: req.files,
            body: req.body
        });
    }
}