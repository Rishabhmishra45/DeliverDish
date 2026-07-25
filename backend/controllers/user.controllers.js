import User from "../models/user.model.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: "userId id not found" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "userId id not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message:`get current user error ${error}` })
    }
}

// delivery boy (ya kisi bhi user) ki live location save karta hai — future live tracking ke liye
export const updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "latitude and longitude are required" })
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { location: { latitude, longitude } },
            { new: true }
        )

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json({ message: "location updated", location: user.location })
    } catch (error) {
        return res.status(500).json({ message: `update location error ${error}` })
    }
}