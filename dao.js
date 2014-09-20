define([
	'mongodb', 
	'jquery', 
	'underscore',
	'sanitizer'],

	function(mongo, $, _, sanitizer) {    

		var Server = mongo.Server,
	    	Db = mongo.Db,
	    	BSON = mongo.BSONPure;

		var db_domain = process.env.DB_DOMAIN || '127.0.0.1';
		var db_port = process.env.DB_PORT || '27017';
		var db_username = process.env.DB_USERNAME || '';
		var db_password = process.env.DB_PASSWORD || '';
				
		var server = new Server(db_domain, db_port, {}),
			db = new Db('thingdb', server, {safe:true});
		
		db.open(function(err, db) {
			if (!err) {
				function onOpen(db) {
					console.log("Connected to 'thingdb' database");
					db.collection('things', {strict : true}, function(err, collection) {});						
				}
				
				if (db_username && db_password) {
					db.authenticate(db_username, db_password, function(err, res) {
						onOpen(db);
					});					
				} else {
					onOpen(db);
				}
				
			} else {
				console.log(err.message);
			}

		});
	


		function fixId(item) {
			item.id = item._id;
			delete item._id;
			return item;
		}
		
		function scrubContent(item) {
			item.title = sanitizer.sanitize(item.title);
			item.title = sanitizer.escape(item.title);
			return item;
		}
	
		return {
			Things: {
				findById : function(id) {
					var deferred = $.Deferred();
					db.collection('things', function(err, collection) {
						collection.findOne({'_id' : new BSON.ObjectID(id) }, function(err, item) {
							scrubContent(item);
							fixId(item);
							deferred.resolve(item);
						});
					});
					return deferred.promise();
				}
				,
				findAll : function() {
					var deferred = $.Deferred();
					db.collection('things', function(err, collection) {
						collection.find().toArray(function(err, items) {
							_.each(items, function(item) {
								scrubContent(item);
								fixId(item);
							});
							deferred.resolve(items);
						});
					});
					return deferred.promise();
				}
				,
				add : function(data) {
					var deferred = $.Deferred();
					db.collection('things', function(err, collection) {
						collection.insert(data, { safe : true }, function(err, results) {
							if (err) {
								deferred.reject(err);
							} else {
								var item = results[0];
								scrubContent(item);
								fixId(item);
								deferred.resolve(item);
							}
						});
					});
					return deferred.promise();
				}
				,
				update : function(data) {
					var deferred = $.Deferred();
					var id = data.id;
					delete data.id;
					db.collection('things', function(err, collection) {
						collection.update({'_id' : new BSON.ObjectID(id)}, data, {safe : true}, function(err, results) {
							if (err) {
								deferred.reject(err);
							} else {
								scrubContent(data);
								data.id = id;
								deferred.resolve(data);
							}
						});
					});
					return deferred.promise();
				}
	// ,
	// delete: function(data) {
	// var id = data.id;
	//			    db.collection('things', function(err, collection) {
	//			        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
	//			            if (err) {
	//			                res.send({'error':'An error has occurred - ' + err});
	//			            } else {
	//			                console.log('' + result + ' document(s) deleted');
	//			                res.send(req.body);
	//			            }
	//			        });
	//			    });
	//			}
			}		
		}
	
});