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
    viewGroupUser: viewGroupUser,
    removeUser: removeUser,
    addUser: addUser
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
    db.oneOrNone('select company_id from user_personal_data where user_id=$1',username)
    .then(function(data) {
       db.oneOrNone(`SELECT user_personal_data.first_name, user_personal_data.last_name, user_personal_data.company_email_id, user_norm_data.Employment_status, (SELECT job_role.job_role FROM job_role WHERE job_role.job_role_id = user_norm_data.job_role_id),(SELECT job_level.job_level FROM job_level WHERE job_level.job_level_id = user_norm_data.job_level_id), user_personal_data.user_id FROM user_personal_data INNER JOIN user_norm_data ON user_personal_data.user_id = user_norm_data.user_id WHERE user_personal_data.company_id = $1 and user_norm_data.status_mark='active'`, data.company_id)
       .then(function(data) {
           res.status(200).json({
               status:'success',
               message:'user details found',
               data:data
           });
       })
    }).catch(function(err) {
        return next(err);
    })
    //query='SELECT data.user_personal_data.first_name, data.user_personal_data.last_name, data.user_personal_data.company_email_id, data.user_norm_data.Employment_status, (SELECT data.job_role.job_role FROM data.job_role WHERE data.job_role.job_role_id = data.user_norm_data.job_role_id), data.user_personal_data.user_id FROM data.user_personal_data INNER JOIN data.user_norm_data ON data.user_personal_data.user_id = data.user_norm_data.user_id WHERE data.user_personal_data.company_id = %s AND data.user_norm_data.status_marker = "active"'
    /*db.oneOrNone('select * from user_personal_data where user_id=$1',username).then(function(data) {
        res.status(200).json({
            status:'Success',
            message:'User Found',
            data:data
        });
    })
    .catch(function(err) {
        return next(err);
    })*/
};

function addUser(req,res,next) {
    db.oneOrNone(`SELECT company_id FROM user_norm_data WHERE user_id =$1 and status_marker='active'`,req.body.user_id)
    .then(function(data) {
        db.oneOrNone('INSERT INTO data.user_personal_data (user_id, first_name, last_name, company_email_id, company_id, DOB) VALUES ($1,$2,$3,$4,$5,$6)',req.body.user_id,req.body.first_name,req.body.last_name,req.body.company_email_id,data.company_id,req.body.DOB)
        .then(function() {
            res.status(200).json({
                status:'Success',
                message:'User added successfully'
            });
        })
    }).catch(function(err) {
        return next(err)
    })
};


function Login(req,res,next) {
    db.oneOrNone('select * from login_table where user_id=${user_id} and password=crypt(${password},password)',req.body).then(function(data) {
        if(data!=null) {
            res.status(200).json({
            status:'Success',
            message:'Login Successful'
            });
        } else {
            res.status(500).json({
                status:'failed',
                message:'user not found'
            })
        }
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
    db.oneOrNone('select company_id from user_personal_data where user_id=$1',req.body.user_id)
    .then(function(data) {
        console.log(data.company_id);
        db.oneOrNone('insert into user_norm_data(user_id,job_role_id,job_level_id,r_city,r_state,h_ft,h_in,res_area,h_edu,m_edu,gender,dom_hand,Employment_status,status_marker, company_id)' +
                    'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [req.body.user_id,req.body.job_role_id,req.body.job_level_id,req.body.r_city,req.body.r_state,req.body.h_ft,req.body.h_in,req.body.res_area,req.body.h_edu,req.body.m_edu,req.body.gender,req.body.dom_hand,req.body.Employment_status,req.body.status_marker,data.company_id])
        .then(function(data) {
            res.status(200).json({
                status:'Success',
                message:'Profile completed successfully'
            });
        }).catch(function(err) {
                return next(err);
           })
    }).catch(function(err) {
            return next(err);
        })
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


function removeUser(req,res,next) {
    db.oneOrNone(`UPDATE user_norm_data SET status_marker = 'deleted' WHERE user_id = $1`,req.body.user_id)
    .then(function(data) {
       db.oneOrNone('DELETE FROM data.user_and_group WHERE user_id = $1', req.body.user_id)
       .then(function(data) {
           res.status(200).json({
               status:'success',
               message:'user delelted successfully'
           });
       })
    }).catch(function(err) {
        return next(err);
    })
};