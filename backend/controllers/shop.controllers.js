import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body

        let shop = await Shop.findOne({ owner: req.userId })

        let image = shop?.image

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        if (!image) {
            return res.status(400).json({ message: "Shop image is required" })
        }

        if (!shop) {
            shop = await Shop.create({
                name, city, state, address, image, owner: req.userId
            })
        } else {
            shop = await Shop.findByIdAndUpdate(shop._id, {
                name, city, state, address, image, owner: req.userId
            }, { new: true })
        }

        await shop.populate("owner items")
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `create shop error ${error}` })
    }
}


export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId }).populate("owner items")
        if (!shop) {
            return null
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `get my shop error ${error}` })
    }
}