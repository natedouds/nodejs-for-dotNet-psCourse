(function (updater) {

    var socketio = require("socket.io");

    updater.init = function (server) {
        var io = socketio.listen(server);

        //callback contains the socket that is connected, and a unique connection will happen for each client
        io.sockets.on("connection", function (socket) {

            console.log("socket was connected");

            //basic example for pushing something to client
            //send to the individual client based on 'showThis' key
            //socket.emit("showThis", "This is from the server");

            //join room - this will prevent notes from showing up under the wrong category
            //on server push
            //this socket belongs to this room (categoryName)
            socket.on("join category", function (categoryName) {
                socket.join(categoryName);
            });

            //listen for message from client
            socket.on("newNote", function (data) {
                //by broadcasting to a room, will narrow the location of where socket.io will push data to
                socket.broadcast.to(data.category).emit("broadcast note", data.note);
            });
        });
    };
})(module.exports);