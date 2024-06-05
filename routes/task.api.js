const express = require('express');
const { createTask, getTasks, addAssignee, deleteTask, getTask } = require('../controller/task.controller');
const router = express.Router();

//read
router.get('/', getTasks);

router.get('/:id', getTask);
//create
router.post('/', createTask);
//addAssignee
router.put('/:id', addAssignee)
//delete
router.delete('/:id', deleteTask)

module.exports = router;