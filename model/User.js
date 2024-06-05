const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const userSchema = Schema({
    name: { type: String, required: true },
    roles: {
        type: String,
        default: "employee",
        enum: ['manager', 'employee']
    },
    taskDocs: [{ type: SchemaTypes.ObjectId, ref: "Task" }]
}, {
    timestamps: true,
})

const User = model('User', userSchema)
module.exports = User