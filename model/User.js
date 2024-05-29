const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = Schema({
    name: { type: String, required: true },
    roles: { type: String, enum: ['manager', 'employee'], required: true }
}, {
    timestamps: true,
})

const User = model('User', userSchema)
module.exports = User