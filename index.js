var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
    host:'localhost',
    port:5432,
    database:'perspectaidev',
    user:'god',
    password:'batman'
});
module.exports = {
    getCompanies: getCompanies,
    getUser: getUser,
    registerCompany: registerCompany,
    Login: Login,
    CreateJobRole: CreateJobRole,
    CreateJobLevel: CreateJobLevel,
    UpdatePassword: UpdatePassword,
    CreateGroup: CreateGroup,
    ViewGroup: ViewGroup,
    UserPersonalInfo: UserPersonalInfo,
    addUserToGroup: addUserToGroup,
    viewGroupUser: viewGroupUser
};


function registerCompany(req,res,next) {
    db.oneOrNone('insert into company_table (company_name,CINorGST,industry,contact,email_id,licence_type,no_of_licences,no_of_modules)' + 'values(${company_name},${CINorGST},${industry},${contact},${email_id},${licence_type},${no_of_licences},${no_of_modules})',req.body)
    .then(function(data) {
        res.status(200).json({
            status:'Success',
            message:'Company registered',
            data:data
        });
    })
    .catch(function(err) {
        return next(err);
    }) 
};

function getCompanies(req,res,next) {
    db.oneOrNone('select * from company_table').then(function(data) {
        res.status(200).json({
            status:'Success',
            message:'Companies retrieved',
            data:data
        });
    })
    .catch(function(err) {
        return next(err);
    })
};


function getUser(req,res,next) {
    let username = req.params.user_id;
    db.oneOrNone('select * from user_personal_data where user_id=$1',username).then(function(data) {
        res.status(200).json({
            status:'Success',
            message:'User Found',
            data:data
        });
    })
    .catch(function(err) {
        return next(err);
    })
};


function Login(req,res,next) {
    db.oneOrNone('select * from login_table where user_id=${user_id} and password=crypt(${password},password)',req.body).then(function(data) {
        res.status(200).json({
            status:'Success',
            message:'Login Successful'
        });
    }).catch(function(err) {
        return next(err);
    })
};


function CreateJobRole(req,res,next) {
    db.oneOrNone('insert into job_role(job_role,company_id) values(${job_role},${company_id})',req.body).then(function(data) {
        res.status(200).json({
            status:'Success',
            message:`Role ${data['job_role']} registered successfully`
        });
    }).catch(function(err) {
        return next(err);
    })
};

function CreateJobLevel(req,res,next) {
    db.oneOrNone('insert into job_level(job_level,company_id) values(${job_level},${company_id})',req.body).then(function(data) {
        res.status(200).json({
            status:'Success',
            message:`Level ${req.body.job_level} registered successfully`
        });
    }).catch(function(err) {
        return next(err);
    })
};


function UpdatePassword(req,res,next) {
    db.oneOrNone("update login_table set password = crypt(${password},gen_salt('md5')) where user_id=${user_id})",req.body).then(function(data) {
        res.status(200).json({
            status:'Success',
            message:'Password updated successfully'
        });
    }).catch(function(err) {
        return next(err);
    })
};


function CreateGroup(req,res,next) {
    if(req.method=='POST'){
        db.oneOrNone('insert into group_table(group_name,job_role_id,job_level_id,assessment_type,company_id,createdby,no_of_machines,status_marker) values(${group_name},${job_role_id},${job_level_id},${assessment_type},${company_id},${created_by},${no_of_machines},${status_marker})',req.body)
        .then(function(data) {
            res.status(200).json({
                status:'Success',
                message:'Group created successfully'
            });
        }).catch(function(err) {
            return next(err);
        })
    }
};

function ViewGroup(req,res,next) {
    if(req.method=='GET') {
        db.oneOrNone('select * from group_table where group_name=$1',req.params.group_name)
        .then(function(data) {
            res.status(200).json({
                status:'Success',
                message:'Group found',
                data:data
            });
        }).catch(function(err) {
            return next(err);
        })
    }
};


function UserPersonalInfo(req,res,next) {
    if(req.method=='POST') {
        db.oneOrNone('insert into user_norm_data(user_id,job_role_id,job_level_id,r_city,r_state,h_ft,h_in,res_area,h_edu,m_edu,gender,dom_hand,company_id,Employment_status,status_marker)' +
                    'values (${user_id},${job_role_id},${job_level_id},${r_city},${r_state},${h_ft},${h_in},${res_area},${h_edu},${m_edu},${gender},${dom_hand},${company_id},${Employment_status},${status_marker})',req.body)
                    .then(function(data) {
                        res.status(200).json({
                            status:'Success',
                            message:'Profile completed successfully'
                        });
                    }).catch(function(err) {
                        return next(err);
                    })
    }
};

function addUserToGroup(req,res,next) {
    if(req.method=='POST') {
        db.oneOrNone('insert into user_and_group(group_id,user_id,scheduling_status) values(${group_id},${user_id},${scheduling_status})',req.body)
        .then(function(data) {
            res.status(200).json({
                status:'Success',
                message:'user added succesfully to group'
            });
        }).catch(function(err) {
            return next(err);
        })
    }
};

function viewGroupUser(req,res,next) {
    if(req.method=='GET') {
        db.oneOrNone('select * from user_and_group where group_id=$1',req.params.group_id)
        .then(function(data) {
            res.status(200).json({
                status:'Success',
                message:'users retrieved successfully',
                data:data.user_id
            });
        }).catch(function(err) {
            return next(err);
        })
    }
};