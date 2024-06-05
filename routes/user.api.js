const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser } = require('../controller/user.controller');

//read
router.get('/', getUsers);

router.get('/:id', getUser);
//create
router.post('/', createUser);
//update

module.exports = router;