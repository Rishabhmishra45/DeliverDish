import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "shop not found" })
        }
        const item = await Item.create({
            name, category, foodType, price, image, shop: shop._id
        })

        shop.items.unshift(item._id)
        await shop.save()

        return res.status(201).json(item)
    } catch (error) {
        return res.status(500).json({ message: `add item error ${error}` })
    }
}


export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, category, foodType, price } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        const item = await Item.findByIdAndUpdate(itemId, {
            name, category, foodType, price, image
        }, { new: true })
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: `edit item error ${error}` })
    }
}


export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId

        const item = await Item.findByIdAndDelete(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }

        await Shop.findByIdAndUpdate(item.shop, {
            $pull: { items: item._id }
        })

        return res.status(200).json({ message: "item deleted", itemId })
    } catch (error) {
        return res.status(500).json({ message: `delete item error ${error}` })
    }
}