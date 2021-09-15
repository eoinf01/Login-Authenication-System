
const db = require('./db');
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {
    // Find the user data by id or username.
    find : function(user = null, callback)
    {

        // prepare the sql query to check if username is in database
        let sql = `SELECT * FROM User WHERE username = ?`;
        db.serialize(function () {
            db.get(sql, user, function(err, result) {
                if(err) throw err
                // if user exists
                if(result) {
                    // callback user data
                    callback(result);
                //if user does not exits
                }else {
                    //callback null
                    callback(null);
                }
            });
        });

    },


    //creating new user
    create : function(body, callback)
    {
        //set variable pwd to password
        var pwd = body.password;
        // Hashing the password so it is encypted before inserting into database
        body.password = bcrypt.hashSync(pwd,10);
        // prepare the sql query for the insert
        let sql = `INSERT INTO User(username,password,role_name) VALUES (?, ?, ?)`;
        // calling the query with the sql string and the values
        db.serialize(function () {
            db.run(sql,body.username,body.password,body.role, function (err, result){
                if(err) throw err;
                callback(result);
            });

        });
    },
    // deleting the user from the database
    // takes in username variable
    delete : function(username,callback){
        // preparing the sql string for delete statement
        let sql = "DELETE FROM User where username = ?";
        // run sql string with value(username)
        db.run(sql,username,function(err,result){
            if(err) throw err;
            callback(result);
        });
    },
    login : function(username, password, callback)
    {
        // find the user data by his username.
        this.find(username, function(user) {
            // if there is a user by this username.
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    // return his data.
                    callback(user);
                    return;
                }
            }
            // if the username/password is wrong then return null.
            callback(null);
        });

    }
}

module.exports = User;