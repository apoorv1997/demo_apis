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
router.post('/api/remove-user', db.removeUser);
router.post('/api/add-user', db.addUser);
router.post('/api/create-module', db.CreateModule);
router.post('/api/add-module', db.AddModuleToGroup);
router.post('/api/purchase-module', db.PurchaseModule);
router.post('/api/delete-module', db.DeleteModuleFromGroup);
router.get('/api/module/:module_id', db.ViewModule);
router.get('/api/all-modules', db.ModuleMarketPlace);
router.get('/api/company-module/:user_id', db.CompanyModuleList);
router.post('/api/add-jobrole', db.AddJobRole);
router.post('/api/add-joblevel', db.AddJobLevel);
router.post('/api/update-role', db.UpdateJobRole);
router.post('/api/update-level', db.UpdateJobLevel);
module.exports = router;




