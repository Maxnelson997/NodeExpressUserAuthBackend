import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

const auth = async (req, res, next) => {
    // Check if the request headers contains the authorization key
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token not found" })
    }

    // Grab token from headers, remove "Bearer" from the string   
    const token = authorization.split(" ")[1];

    try {
        // Decode and extract user id from token
        const { _id } = jwt.verify(token, process.env.SECRET)
        // Save user in request
        req.user = await User.findById(_id).select("_id")

        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}

export default auth;