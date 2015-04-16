var pwdMgr = require('./managePasswords');
 

 function getUser(req){
    return {
        name: req.param('name'),
        email: req.param('email'),
        password: req.param('password'),
    };
 }

module.exports = function (server, db) {
    // unique index
    db.appUsers.ensureIndex({
        email: 1
    }, {
        unique: true
    })
 


    server.post('/register', function (req, res) {
         var user = getUser(req);
        pwdMgr.cryptPassword(user.password, function (err, hash) {
            user.password = hash;
            db.appUsers.insert(user,
                function (err, dbUser) {
                    if (err) { // duplicate key error
                         if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                      
                             res.writeHead(400, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                res.end(JSON.stringify({
                                    error: err,
                                    message: "A user with this email already exists"
                                })); //remove from here
                           } else {
                            res.writeHead(400, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                res.end(JSON.stringify({
                                    error: err,
                                    message: "Error accessing the db"
                                }));
                           }
                    } else {                       
                       
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        dbUser.password = "";
                        res.end(JSON.stringify(dbUser));
                    }
                });
        });
// console.log('foo');
        //return next();
        
        //res.send({success: true, name: user.name, password: user.password});
    });
 
    server.post('/login', function (req, res) {
        var user = getUser(req);
        
        //req.params;
        if (user.email.trim().length == 0 || user.password.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid Credentials"
            }));
        }
        console.log("in");
        db.appUsers.findOne({
            email: user.email
        }, function (err, dbUser) {
 
            pwdMgr.comparePassword(user.password, dbUser.password, function (err, isPasswordMatch) {
 
                if (isPasswordMatch) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    // remove password hash before sending to the client
                    dbUser.password = "";
                    res.end(JSON.stringify(dbUser));
                } else {
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "Invalid User"
                    }));
                }
 
            });
        });
        //return next();
    });
};