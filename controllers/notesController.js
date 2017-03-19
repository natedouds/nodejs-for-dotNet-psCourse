(function (notesController) {

    notesController.init = function (app) {

        let data = require("../data");
        let auth = require("../auth");

        //what you return really determines whether or not it's an API (i.e. we'll return json here)
        app.get("/api/notes/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {

                let categoryName = req.params.categoryName;

                data.getNotes(categoryName,
                    function (err, notes) {
                        //need to manually set status codes
                        if (err) {
                            res.send(400, err);
                        } else {
                            res.set("Content-Type", "application/json");
                            res.send(notes.notes);
                        }
                    });

            });

        app.post("/api/notes/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {

                const categoryName = req.params.categoryName;
                const noteToInsert = {
                    note: req.body.note,
                    color: req.body.color,
                    author: "Shawn Wildermuth"
                };

                data.addNote(categoryName,
                    noteToInsert,
                    //assume if no error, it inserted correctly
                    function (err) {
                        if (err) {
                            resp.send(400, "Failed to add note to data store");
                        } else {
                            res.set("Content-Type", "application/json");
                            res.send(201, noteToInsert);
                        }
                    });

            });

    };

})(module.exports);