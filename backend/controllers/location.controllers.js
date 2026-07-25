import User from "../models/user.model.js"

export const updateLocation = async (req, res) => {
    try {
        const { city, latitude, longitude } = req.body

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                city,
                location: { latitude, longitude }
            },
            { new: true }
        )

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json({ message: "location updated" })
    } catch (error) {
        return res.status(500).json({ message: `update location error ${error}` })
    }
}