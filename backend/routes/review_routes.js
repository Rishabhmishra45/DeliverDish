import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { addReview, getMyReviewsForOrder } from "../controllers/review.controllers.js"

const reviewRouter = express.Router()

reviewRouter.post("/add-review", isAuth, addReview)
reviewRouter.get("/my-reviews/:orderId", isAuth, getMyReviewsForOrder)

export default reviewRouter