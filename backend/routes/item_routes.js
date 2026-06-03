import express from "express"
import isAuth from "../middlewares/isAuth"
import { addItem, editItem } from "../controllers/item.controllers"
import { upload } from "../middlewares/multer.js"


const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem)

export default itemRouter