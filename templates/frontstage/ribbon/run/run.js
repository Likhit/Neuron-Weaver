//Run the network with the supplied input sets.
var play = $("#play");
var pause = $("#pause");
var resume = $("#resume");
var stepForward = $("#step-forward");
var stepBackward = $("#step-backward");
var stop = $("#stop");
play.on("click", function(e) {
    var wavelength = Main.inputSetter.data("wavelength");
    var inputSets = Main.inputSetter.data("input-sets");
    var timeUnitInput = $("#time-unit");
    var timeUnit = parseInt(timeUnitInput.val(), 10);
    if (timeUnit < 500) {
        timeUnit = 500;
        timeUnitInput.val(500);
    }
    Main.ann.compute(inputSets, wavelength);
    Main.ann.startAnimation(timeUnit, function() {
        play.addClass("hidden");
        pause.removeClass("hidden");
        stop.removeClass("disabled");
    }, function() {
        pause.addClass("hidden");
        play.removeClass("hidden");
        resume.addClass("hidden");
        pause.addClass("hidden");
        stop.addClass("disabled");
        stepForward.addClass("disabled");
        stepBackward.addClass("disabled");
    });
    
});

pause.on("click", function(e) {
    Main.ann.pauseAnimation();
    pause.addClass("hidden");
    resume.removeClass("hidden");
    stepForward.removeClass("disabled");
    stepBackward.removeClass("disabled");
});

resume.on("click", function(e) {
    Main.ann.resumeAnimation();
    resume.addClass("hidden");
    pause.removeClass("hidden");
    stepForward.addClass("disabled");
    stepBackward.addClass("disabled");
});

stepForward.on("click", function(e) {
    if (!stepForward.hasClass("disabled")) {
        Main.ann.stepNext();   
    }
});

stepBackward.on("click", function(e) {
    if (!stepBackward.hasClass("disabled")) {
        Main.ann.stepBack();
    }
});

stop.on("click", function(e) {
    if (!stop.hasClass("disabled")) {
        Main.ann.stopAnimation();
    }
});

//Show input setting form.
$("#inputs").on("click", function(e) {
    Main.inputSetter.trigger("show");
});

//Show training-data setting form.
$("#training-input").on("click", function(e) {
    Main.trainingDataSetter.trigger("show");
});