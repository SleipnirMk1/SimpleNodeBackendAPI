var express = require('express');
var auth = require('./auth');
var router = express.Router();
var verify = require('./verify')

router.post('/api/v1/login', auth.login);
router.get('/api/v1/getJobList', verify(), auth.getJobList)
router.get('/api/v1/getJobDetail/:id', verify(), auth.getJobDetail)

module.exports = router;