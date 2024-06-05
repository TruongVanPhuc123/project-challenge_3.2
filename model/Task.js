const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const taskSchema = Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'working', 'review', 'done', 'archive'] },
    isDelete: { type: Boolean, default: false },
    assignee: { type: SchemaTypes.ObjectId, ref: "User" }
}, {
    timestamp: true,
})

const Task = model('Task', taskSchema)
module.exports = Task;