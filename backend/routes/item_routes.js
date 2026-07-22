import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { addItem, editItem, deleteItem } from "../controllers/item.controllers.js"
import { upload } from "../middlewares/multer.js"


const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem)
itemRouter.delete("/delete-item/:itemId", isAuth, deleteItem)

export default itemRouter