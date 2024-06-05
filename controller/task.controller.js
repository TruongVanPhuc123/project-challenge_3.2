const { default: mongoose } = require("mongoose");
const { ApiError } = require("../error/ApiError");
const { sendResponse } = require("../helpers/utils")
const Task = require("../model/Task")
const User = require("../model/User")
const Joi = require('joi');

const taskController = {}

taskController.createTask = async (req, res, next) => {
    const data = req.body
    try {
        const schema = Joi.object({
            name: Joi.string().required().max(30),
            description: Joi.string().required(),
            status: Joi.string().valid('pending', 'working', 'review', 'done', 'archive')
        })
        const { error, value } = schema.validate(data, { abortEarly: false })

        if (error) {
            next(new ApiError(error.message, 400))
        }
        const created = await Task.create(value)
        sendResponse(res, 200, created, null, `Task created successfully !`)
    } catch (error) {
        next(error)
    }
}

taskController.getTasks = async (req, res, next) => {
    const data = req.query

    const schema = Joi.object({
        limit: Joi.string().default(5),
        page: Joi.string().default(1),
        search: Joi.string().default("")
    })

    const { error, value } = schema.validate(data, { abortEarly: false })
    const { limit, page, search } = value

    let status = req.query.status || "All"
    const statusOptions = ['pending', 'working', 'review', 'done', 'archive']

    status === "All" ? status = [...statusOptions] : status = req.query.status

    if (error) {
        next(ApiError(error.message, 400))
    }

    const tasks = await Task.find({ name: { $regex: search, $options: 'i' } })
        .where("status")
        .in(status)
        .limit(limit)
        .skip(limit * (page - 1))
        .populate('assignee')

    sendResponse(res, 200, tasks, null, `Tasks have ${tasks.length} length !`)
}

taskController.getTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const ObjectId = mongoose.Types.ObjectId;
        const checkID = ObjectId.isValid(id)

        if (!checkID) {
            next(new ApiError("TaskID in valid", 400))
        }

        const task = await Task.findById(id).populate('assignee')

        if (!task) {
            next(new ApiError("Task not in database", 400))
        }

        sendResponse(res, 200, task, null, "Find Complete !")
    } catch (error) {
        next(error)
    }
}

taskController.addAssignee = async (req, res, next) => {
    try {
        const { ref } = req.body
        const { id } = req.params
        const ObjectId = mongoose.Types.ObjectId;

        const checkUserID = ObjectId.isValid(ref)
        const checkTaskID = ObjectId.isValid(id)

        if (!checkUserID) {
            next(new ApiError("UserId in valid", 400))
        }
        if (!checkTaskID) {
            next(new ApiError("TaskId in valid", 400))
        }

        const task = await Task.findById(id)
        const user = await User.findById(ref)

        if (!task) {
            next(new ApiError("Task not in database", 400))
        }

        task.assignee = ref
        user.taskDocs.push(id)
        task.save()
        user.save()

        sendResponse(res, 200, task, null, 'Add assignee success')
    } catch (error) {
        next(error)
    }
}

taskController.deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const ObjectId = mongoose.Types.ObjectId;
        const checkID = ObjectId.isValid(id)

        if (!checkID) {
            next(new ApiError("Id in valid", 400))
        }
        const task = await Task.findById(id)

        if (!task) {
            next(new ApiError("Task not in database", 400))
        }

        task.isDelete = true
        task.save()

        sendResponse(res, 200, task, null, "Delete success")
    } catch (error) {
        next(error)
    }
}

module.exports = taskController;