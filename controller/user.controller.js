const { sendResponse } = require("../helpers/utils");
const User = require("../model/User");

const userController = {}

userController.createUser = async (req, res, next) => {
    const user = req.body
    // const userEmployee = { name: user.name + " " + "employee" }
    try {
        if (!user) {
            const error = new Error('Invalid User !')
            error.statusCode = 404
            error.isOperational = true;
            error.errorType = "Client Error !"
            throw error
        }
        const createUser = await User.create(user)
        sendResponse(res, 200, createUser, null, `Create ${user.roles} ${user.name} successfully !`)
    } catch (error) {
        next(error)
    }
}

userController.getUsers = async (req, res, next) => {
    const filters = {}
    const { search } = req.query
    try {
        const getUsers = await User.find(filters)
        if (search) {
            const user = getUsers.find(user => user.name === search)
            sendResponse(res, 200, user, null, `Find ${user.roles} ${search} successfully !`)
        }
        sendResponse(res, 200, getUsers, null, `Model Users Has ${getUsers.length} Lengths !`)
    } catch (error) {
        next(error)
    }
}

userController.updateUser = async (req, res, next) => { }

module.exports = userController;