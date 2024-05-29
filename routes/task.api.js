const express = require('express');
const { createTask, getTasks, addAssignee } = require('../controller/task.controller');
const router = express.Router();

//read
router.get('/', getTasks);
//create
router.post('/', createTask);
//addAssignee
router.put('/:targetName', addAssignee)

module.exports = router;