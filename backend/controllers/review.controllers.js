import Review from "../models/review.model.js"
import Item from "../models/item.model.js"
import Order from "../models/order.model.js"

export const addReview = async (req, res) => {
    try {
        const { orderId, shopOrderId, itemId, rating, comment } = req.body

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "rating must be between 1 and 5" })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        if (order.user.toString() !== req.userId) {
            return res.status(403).json({ message: "not authorized for this order" })
        }

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }

        if (shopOrder.status !== "delivered") {
            return res.status(400).json({ message: "you can only review items after delivery" })
        }

        const itemExistsInOrder = shopOrder.items.some((i) => i.item.toString() === itemId)
        if (!itemExistsInOrder) {
            return res.status(400).json({ message: "item not part of this order" })
        }

        let review

        try {
            review = await Review.create({
                user: req.userId,
                item: itemId,
                order: orderId,
                shopOrderId,
                rating,
                comment
            })
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "you have already reviewed this item for this order" })
            }
            throw error
        }

        // item ki average rating aur count recalculate karo
        const allReviews = await Review.find({ item: itemId })
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
        const average = totalRating / allReviews.length

        await Item.findByIdAndUpdate(itemId, {
            rating: {
                average,
                count: allReviews.length
            }
        })

        return res.status(201).json({ review })

    } catch (error) {
        return res.status(500).json({ message: `add review error ${error}` })
    }
}


// ek user ne ek particular order ke items ke liye already review diya hai ya nahi, check karne ke liye
export const getMyReviewsForOrder = async (req, res) => {
    try {
        const { orderId } = req.params

        const reviews = await Review.find({ user: req.userId, order: orderId })

        return res.status(200).json(reviews)
    } catch (error) {
        return res.status(500).json({ message: `get my reviews error ${error}` })
    }
}