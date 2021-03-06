define([ 'mongodb', 'jquery', 'underscore', 'sanitizer', 'dao/things',
        'dao/users' ],

function(mongo, $, _, sanitizer, DAOThings, DAOUsers) {

        var Server = mongo.Server,
            Db = mongo.Db;

        var db_domain = process.env.DB_DOMAIN || '127.0.0.1';
        var db_port = process.env.DB_PORT || '27017';
        var db_username = process.env.DB_USERNAME || '';
        var db_password = process.env.DB_PASSWORD || '';
                
        var server = new Server(db_domain, db_port, {}),
            db = new Db('thingdb', server, {safe:true});
        
        db.open(function(err, db) {
            
            function onOpen(db) {
                console.log("Connected to 'thingdb' database");
                db.collection('things', {strict : true}, function(err, collection) {});
                db.collection('users', {strict : true}, function(err, collection) {});
            }
            
            if (!err) {
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

        return {
            things: new DAOThings(db),
            users: new DAOUsers(db)
        };

});