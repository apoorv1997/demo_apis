var express = require('express');
var router = express.Router();
var db = require('../index');

router.get('/api/companies', db.getCompanies);
router.get('/api/user/:user_id', db.getUser);
router.post('/api/login', db.Login);
router.post('/api/job-role', db.CreateJobRole);
router.post('/api/job-level', db.CreateJobLevel);
router.post('/api/update-password', db.UpdatePassword);
router.post('/api/create-group', db.CreateGroup);
router.get('/api/group/:group_name', db.ViewGroup);
router.post('/api/update-profile', db.UserPersonalInfo);
router.post('/api/add-user-group', db.addUserToGroup);
router.get('/api/view-group/:group_id', db.viewGroupUser);

module.exports = router;




