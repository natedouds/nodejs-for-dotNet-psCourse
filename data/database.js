(function (database) {

    var mongodb = require('mongodb');

    //path to get at the instance and db
    //first time it sees the db, it will build it (i.e. don't have to create 'theBoard' first)
    var mongoUrl = "mongodb://localhost:27017/theBoard";

    var theDb = null;

    database.getDb = function (next) {
        if (!theDb) {
            //connect to the db
            mongodb.MongoClient.connect(mongoUrl,
                function (err, db) {
                    if (err) {
                        next(err, null);
                    } else {
                        theDb = {
                            db: db,
                            notes: db.collection("notes")
                        };
                        next(null, theDb);
                    }
                });
        } else {
            next(null, theDb);
        }
    }


})(module.exports);