const Waste = require("../model/WasteModel")
const cloudinary = require("cloudinary")

const createProduct = async(req, res) => {
    console.log(req.body)
    console.log(req.files)
    //Destructuring data 
    const {title, description, price} = req.body;
    const{wasteImageurl} = req.files;

    //Now Validation
    if(!title || !description || !price || !wasteImageurl){
        return res.json({
            success: false,
            message: "Please enter all fields"
        })
    }

    //Uploading image to cloudinary
    try {
        const uploadedImage = await cloudinary.v2.uploader.upload(
            wasteImageurl.path,
            {
                folder: "foharmalai/products",
                crop: "scale"
            }
        )
        //After saving image to cloudinary .. now saving data to our Waste databse 
        const newProduct = new Waste({
            title: title,
            description: description,
            price: price,
            wasteImageurl: uploadedImage.secure_url
        })
        await newProduct.save()
        res.json({
            success: true,
            message: "Product is Created.",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }

}

module.exports = {
    createProduct
}