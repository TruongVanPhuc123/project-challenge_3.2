const Joi = require("joi");
const { ApiError } = require("../error/ApiError");
const { sendResponse } = require("../helpers/utils");
const User = require("../model/User");
const { default: mongoose } = require("mongoose");

const userController = {}

userController.createUser = async (req, res, next) => {
    try {
        const data = req.body

        const schema = Joi.object({
            name: Joi.string().required(),
            roles: Joi.string().valid('manager', 'employee').default('employee')
        })

        const { error, value } = schema.validate(data, { abortEarly: false })

        if (error) {
            next(new ApiError(error.message, 400))
        }

        const user = await User.findOne({ name: value.name });

        if (!user) {
            const createdUser = await User.create(value)
            sendResponse(res, 200, createdUser, null, "User created success")
        }
        next(new ApiError("User have in database", 409))

    } catch (error) {
        next(error)
    }
}

userController.getUsers = async (req, res, next) => {
    try {
        const data = req.query

        const schema = Joi.object({
            limit: Joi.number().default(5),
            page: Joi.number().default(1),
            search: Joi.string().default(""),
            // roles: Joi.string().default("ALL")
        })
        const { error, value } = schema.validate(data, { abortEarly: false })
        const { page, limit, search } = value
        // let { roles } = value

        let roles = req.query.roles || "All";
        const roleOptions = ["employee", "manager"]

        roles === "All" ? roles = [...roleOptions] : roles = req.query.roles

        if (error) {
            next(new ApiError(error.message, 400))
        }

        const users = await User.find({ name: { $regex: search, $options: "i" } })
            .where('roles')
            .in(roles)
            .limit(limit)
            .skip(limit * (page - 1))
            .populate("taskDocs")

        sendResponse(res, 200, users, null, `Users have ${users.length} length !`)
    } catch (error) {
        next(error)
    }
}


userController.getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const ObjectId = mongoose.Types.ObjectId;
        const checkID = ObjectId.isValid(id)

        if (!checkID) {
            next(new ApiError("UserId in valid", 400))
        }

        const user = await User.findById(id).populate("taskDocs")

        if (!user) {
            next(new ApiError("User not in database", 400))
        }

        sendResponse(res, 200, user, null, "Find Complete !")
    } catch (error) {
        next(error)
    }
}
module.exports = userController;