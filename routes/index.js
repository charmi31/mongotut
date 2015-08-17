var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {	
	db.collection("user").find({}).toArray(function(error, users) { 		
		res.render('list', { 			
			userArray: users
		});
	});
});

router.get('/save', function(req, res, next) {		
	var userId = req.query.id ? req.query.id : null;	
	if(userId) {
		db.collection("user").findOne({"_id": new ObjectId(userId)}, function(error, user) {
			console.log(user);
			res.render('save', { 			
				userArray: user
			});
		});		
	} else {
		res.render('save', { 			
			userArray: null
		});
	}	
});

router.get('/delete', function(req, res, next) {		
	var userId = req.query.id ? req.query.id : null;	
	if(userId) {
		db.collection("user").remove({"_id": new ObjectId(userId)}, function(error){
			res.redirect("/");
		});		
	} else {
		res.render('save', { 			
			userArray: null
		});
	}	
});

router.post('/', function(req, res, next) {		
	var id = req.body.id ? req.body.id : null;
	var data = {
				username: req.body.email, 
				firstName: req.body.firstName ? req.body.firstName : "",
				lastName: req.body.lastName ? req.body.lastName : "",
				email: req.body.email ? req.body.email : "",
                phone: req.body.phone ? req.body.phone : "",
                password: req.body.password ? req.body.password : "",
                address: {
              		street: "123 Fake Street",
              		city: "Faketon",
              		state: "MA",
              		zip: "12345"
            	}
            };
	if(id) {
		db.collection("user").update(
			{ "_id": new ObjectId(id)}, 
			{ $set: {
				"firstName": req.body.firstName, 
				"lastName": req.body.lastName, 
				"phone": req.body.phone, 
				"password": req.body.password}
			}, function(err){
				if(err){
		    		console.log("err : " +  err);
		    		res.status(500).send('Opps! some error occured');
		    	} else {
		    		res.writeHead(200, { 'Content-Type': 'application/json' });	
		    		var response = {
							message: "User added successfully!",
							status: 200
						}
		    		res.end(JSON.stringify(response));
		    	}
			}
		);
	} else {
		db.collection("user").insert(data, function(err){
	    	if(err){
	    		console.log("err : " +  err);
	    		res.status(500).send('Opps! some error occured');
	    	} else {
	    		res.writeHead(200, { 'Content-Type': 'application/json' });	
	    		var response = {
						message: "User added successfully!",
						status: 200
					}
	    		res.end(JSON.stringify(response));
	    	}
   		});  
	}		     		
});

module.exports = router;
