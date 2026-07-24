import User from "../models/user.model.js";

export const updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const existing = user.cart.find((c) => c.item.toString() === itemId)

        if (quantity <= 0) {
            user.cart = user.cart.filter((c) => c.item.toString() !== itemId)
        } else if (existing) {
            existing.quantity = quantity
        } else {
            user.cart.push({ item: itemId, quantity })
        }

        await user.save()
        await user.populate("cart.item")

        return res.status(200).json({ cart: user.cart })
    } catch (error) {
        return res.status(500).json({ message: `update cart error ${error}` })
    }
}


export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("cart.item")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json({ cart: user.cart })
    } catch (error) {
        return res.status(500).json({ message: `get cart error ${error}` })
    }
}