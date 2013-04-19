var url = require('url')
var levelup = require('levelup')
var userDb = levelup('./db/userz')
var secret = require('./secret')
var easyPbkdf2 = require('easy-Pbkdf2')()
var crypto = require('crypto')

exports.findById = function(req, res) {
    var id = req.params.id;
    //console.log('Retrieving user: ' + id);
    userDb.get(id, function(err, user){
    	if(err){
    		console.log("ERr: "+err);
    	}else{
    		res.writeHead(200, {
			  'Content-Type': 'text/plain' });
    		// for(var i=0; i<user.length; i++){
    		// 	console.log(i+" is "+user[i])
    		// }
    		console.log("Fetched "+JSON.stringify(user))
    		res.end(JSON.stringify(user))
    	}
    })
};

exports.authenticate = function(req, res) {
	console.log("Authenticating...")
	authenticateCookie(req, function(err, user){
		if(err){
			console.log("user not authenticated.")
			res.writeHead(401)
			res.end()
		}else{
			console.log("user "+user.username+" authenticated.")
			res.writeHead(200)
			res.end(privateJSONFor(user))
		}
	})
};

var authenticateCookie = function(req, cb){
	if(req.cookies.cnvuser){
		var cookie = req.cookies.cnvuser.split('|'),
		username = cookie[0],
		hash = cookie[1]
		userDb.get(username, function(err, user){
			if(err){
				cb(err)
			}else{
				var shasum = crypto.createHash('sha256')
				shasum.update(user.username+secret+user.salt)
				var correctHash = shasum.digest('hex')
				if(hash===correctHash){
					cb(null, user)
				}
			}
		})
	}else{
		cb("No cnv user cookie found.")
	}
}
exports.authenticateCookie = authenticateCookie;

function privateJSONFor(user){
	return JSON.stringify(user, [username, userLink])
}
 
exports.findAll = function(req, res) {
	console.log("Users requested")
	var limit = 50
	var sent = 0
	responseList = []
	res.writeHead(200, {
		'Content-Type':'text/JSON',
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
		'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, Authorization'
	})
	//res.write('[')
	userDb.createValueStream().on('data', function(data){
		responseList.push(data)
		// console.log(data)
		// if(sent<limit){
		// 	if(!sent===0){
		// 		res.write(','+data)

		// 	}else{
		// 		res.write(data)
		// 	}
		// 	//res.write(data)
		//  	sent++
		// }
	}).on('end', function(){
		//res.end()
		res.end(JSON.stringify(responseList))

		res.end("")
		console.log("Ending connection.")
	}).on('close',function(){
		console.log("Closing connection.")
	})
};
 
var userRE = new RegExp('[a-z0-9_-]{3,20}')
exports.adduser = function(req, res) {
    var user = req.params;

    console.log("Add user: "+JSON.stringify(user))
    if(userRE.test(user.username)){
	    var salt = easyPbkdf2.generateSalt()
	    easyPbkdf2.secureHash( password, salt, function( err, passwordHash, originalSalt ) {
	    	var finalUser = {
		    	username:user.username,
		    	verified:false,
		    	password:passwordHash,
		    	salt:originalSalt,
		    }
		    userDb.get(user.username, function(err, user){
		    	if(user){
		    		res.redirect('/register?error=duplicate')
		    	}else{
		    		userDb.put(user.username, JSON.stringify(user), function(err){
				    	if(err){
				    		console.log("Database error.")
				    		res.redirect('/register?error=serverError')
				    	}else{
				    		console.log("Save succeeded!")
							var shasum = crypto.createHash('sha256')
							shasum.update(user.username+secret+originalSalt)
				    		response.writeHead(200, {
				    			'Set-Cookie':'cnvuser='+user.username+'|'+shasum.digest('hex')
				    		})
				    		res.redirect('/welcome')
				    	}
				    	console.log("Ta da!")
				    })
		    	}
		    })
		});
    }else{
    	res.redirect('/register?error=invalidUsername')
    }
}

// exports.authenticate = function(req, res, next){
// 	var theirCookie = req.cookies.cnvuser
// 	var components = theirCookie.split('|')
// 	var username = components[0]
// 	var hash = components[1]
// 	var shasum = crypto.createHash('sha256')
// 	shasum.update(username+secret+originalSalt)
// 	var correct = shasum.digest('hex')
// 	if(hash===correct){
// 		next()
// 	}else{
// 		res.redirect('/login')
// 	}
// }
 
exports.updateuser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}
 
exports.deleteuser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}



// //populate database:
// for(var i=0; i< 10; i++){
// 	var user = {
// 		username: "UserNumber"+i,
// 		position: "You know what I do."
// 	}
// 	userDb.put(user.username, JSON.stringify(user), function(err){
//     	if(err){
//     		console.log("Database error.")
    		
//     	}else{
    		
//     	}
//     	console.log("Ta da!")
//     })
// }