$("#newtrainData").hide();

$("#AddnewTrain").on("click", function () {
    $("#newtrainData").show();
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRfvC72Au5xd50ypdhlANoIndUEOAGGGc",
    authDomain: "trainscheduler-cbb18.firebaseapp.com",
    databaseURL: "https://trainscheduler-cbb18.firebaseio.com",
    projectId: "trainscheduler-cbb18",
    storageBucket: "",
    messagingSenderId: "575110533121"
};

firebase.initializeApp(config);

// create a database reference.
database = firebase.database();

$("#SubmitTrain").on("click", function (event) {
    event.preventDefault();

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firsttrain = moment($("#first").val().trim(), "HH:mm").format("X");
    var frequency = moment($("#frequency").val().trim(), "mm").format("X");

    if (name !== "" && destination !== "" && firsttrain !== "" && frequency !== "") {
        database.ref().push({
            name: name,
            destination: destination,
            first: firsttrain,
            frequency: frequency
        });
    } else {
        alert("Please enter all fields of the form!")
    }
    
    $("#name").val("");
    $("#destination").val("");
    $("#first").val("");
    $("#frequency").val("");
    $("#newtrainData").hide();
});

// firebase will detect any changes that occur and update the view
database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    // Current Time
    var currentTime = moment();
    // console.log("Current Time: " + currentTime);

    var trainName = sv.name;
    //console.log("trainName: " + trainName);
    var destination = sv.destination;
    //console.log("destination: " + destination);

    var trainEveryMinutes = moment.unix(sv.frequency).format("mm");

    var firstTrain = moment.unix(sv.first).subtract(1, "years");

    var difference = moment().diff(moment(firstTrain), "minutes");

    var remainder = difference % trainEveryMinutes;

    var minutesAway = trainEveryMinutes - remainder;

    var nextArrival = moment().add(minutesAway, "minutes");
    var tRow = $("<tr>");

    tRow.append($("<td>").append(trainName));
    tRow.append($("<td>").append(destination));
    tRow.append($("<td>").append(trainEveryMinutes));
    tRow.append($("<td>").append(nextArrival.format("hh:mm a")));
    tRow.append($("<td>").append(minutesAway));

    $("tbody").append(tRow);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

