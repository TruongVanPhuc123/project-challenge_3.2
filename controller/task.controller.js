const { sendResponse } = require("../helpers/utils")
const Task = require("../model/Task")
const User = require("../model/User")

const taskController = {}

taskController.createTask = async (req, res, next) => {
    const data = req.body
    try {
        if (!data) {
            const error = new Error('Invalid Data !')
            error.statusCode = 404
            error.isOperational = true;
            error.errorType = "Client Error !"
            throw error
        }
        const createTask = await Task.create(data)
        sendResponse(res, 200, createTask, null, `Task ${data.name} created successfully !`)
    } catch (error) {
        next(error)
    }
}
taskController.getTasks = async (req, res, next) => {
    const filter = {}
    try {
        const getTasks = await Task.find(filter).populate("assignee");
        sendResponse(res, 200, getTasks, null, `Model Users Has ${getTasks.length} Lengths !`)
    } catch (error) {
        next(error)
    }
}

taskController.addAssignee = async (req, res, next) => {
    const { targetName } = req.params
    const { ref } = req.body
    const data = req.body
    try {
        if (ref) {
            let found = await Task.findOne({ name: targetName })
            // await User.findById(ref)
            found.assignee = ref
            found = await found.save()
            sendResponse(res, 200, { data: found }, null, "Add reference success")
        }
        const update = await Task.findOneAndUpdate({ name: targetName }, data, { new: true })
        sendResponse(res, 200, update, null, "Update success")
    } catch (error) {
        next(error)
    }
}

taskController.deleteTask = async (req, res, next) => {
    const { id } = req.params
    try {
        const deleted = await Task.findByIdAndDelete(id)
        sendResponse(res, 200, deleted, null, "Delete success")
    } catch (error) {
        next(error)
    }
}

module.exports = taskController;