//notesView.js
(function (angular) {
    //ui.bootstrap needed for button group
    var theModule = angular.module("notesView", ["ui.bootstrap"]);

    theModule.controller("notesViewController", ["$scope", "$window", "$http", notesViewController]);

    function notesViewController($scope, $window, $http) {
        $scope.notes = [];
        $scope.newNote = createBlankNote();

        //get the category name
        var urlParts = $window.location.pathname.split("/");
        var categoryName = urlParts[urlParts.length - 1];
        //assemble the get url
        var notesUrl = "/api/notes/" + categoryName;

        //get the category notes
        $http.get(notesUrl)
            .then(function (result) {
                //success
                $scope.notes = result.data;
            },
                function (err) {
                    //error
                    alert(err);
                });

        //save new note
        $scope.save = function () {
            $http.post(notesUrl, $scope.newNote)
                .then(function (result) {
                    //success
                    //add new note
                    $scope.notes.push(result.data);
                    //clear the note
                    $scope.newNote = createBlankNote();
                }, function (err) {
                    //failure
                });
        };

        function createBlankNote() {
            return {
                note: "",
                color: "yellow"
            };
        }
    }
})(window.angular);