import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { updateCartItem, getCart } from "../controllers/cart.controllers.js"


const cartRouter = express.Router()

cartRouter.post("/update-cart", isAuth, updateCartItem)
cartRouter.get("/get-cart", isAuth, getCart)


export default cartRouter