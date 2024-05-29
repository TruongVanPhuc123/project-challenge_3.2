const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controller/user.controller');

//read
router.get('/', getUsers);
//create
router.post('/', createUser);
//update

module.exports = router;