(function (data) {
    var seedData = require("./seedData");
    var database = require("./database");

    data.getNoteCategories = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                //if you don't pass anything to find, it returns everything
                //you can pass something like { name: "People" } or { notes: { $size: 5 } } to find, to filter the result set (much like linq where clause)
                //sort will sort by name in ascending order (use -1 for descending)
                db.notes.find().sort({ name: 1 }).toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

    //go to http://localhost:28017/theBoard/notes/ to see new categories
    data.createNewCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                //see if one exists (note: it appears to be case sensitive!)
                db.notes.find({ name: categoryName })
                    .count(function (err, count) {
                        if (err) {
                            next(err);
                        } else {
                            if (count !== 0) {
                                next("Category already exists");
                            } else {
                                var cat = {
                                    name: categoryName,
                                    notes: []
                                };
                                db.notes.insert(cat,
                                    function (err) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            next(null);
                                        }
                                    });
                            }
                        }
                    });
            }
        });
    };

    data.getNotes = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                //find one instance, think FirstOrDefault()
                //this example is for case-insensitive matching
                db.notes.findOne({ name: { '$regex': categoryName, $options: 'i' } }, next);
                //this example is for case-sensitive matching
                //db.notes.findOne({ name: { '$regex': categoryName, $options: 'i' } }, next);
            }
        });
    };

    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                //even though this is logically an 'insert' i.e. creation of new note
                //it is the creation of a new object that is INSIDE an existing object
                //go find the named category, and push into the note collection our new noteToInsert
                //essentially take the new note and insert it as one of the array that is note inside of the document that is for our category name
                db.notes.update({name: categoryName}, {$push: {notes: noteToInsert}}, next); //pass the next callback since update wants an error callback
            }
        });
    };

    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                //test to see if data exists yet
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("Failed to retrieve database count");
                    } else {
                        if (count === 0) {
                            console.log("Seeding the database...");
                            seedData.initialNotes.forEach(function (item) {
                                db.notes.insert(item,
                                    function (err) {
                                        if (err) {
                                            console.log("Failed to insert note into database: " + err);
                                        }
                                    });
                            });
                        } else {
                            console.log("Database already seeded");
                        }
                    }
                });
            }
        });
    }

    seedDatabase();

})(module.exports);