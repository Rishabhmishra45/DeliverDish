import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { updateLocation } from "../controllers/location.controllers.js"

const locationRouter = express.Router()

locationRouter.post("/update-location", isAuth, updateLocation)

export default locationRouter