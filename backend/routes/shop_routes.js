import express from "express"
import { createEditShop } from "../controllers/shop.controllers"
import isAuth from "../middlewares/isAuth"
import { upload } from "../middlewares/multer.js"


const shopRouter = express.Router()

shopRouter.get("/create-edit", isAuth,upload.single("image") ,createEditShop)

export default shopRouter