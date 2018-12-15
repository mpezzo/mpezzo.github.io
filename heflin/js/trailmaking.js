String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
$("#practice").click(function() {
  $(".inner").hide();
  $(".practiceExercise").show();
})
var number = 1;
var trailMaker = 0;
var timer = 0;
var totalTime1 = 0;
var totalTime2 = 0;
$(".circle").click(function() {
  if($(this).attr("id") == number) {
    $(this).css("background-color", "lime");
    $(".incorrect").removeClass("incorrect");
    if(number == 5) {
      if(trailMaker == 2) {
        var currentTimer = new Date();
        $(".trailMaker2").hide();
        currentTimer = currentTimer.getTime();
        totalTime2 = currentTimer - timer;
        link = link.replaceAll("blank1", totalTime1);
        link = link.replaceAll("blank2", totalTime2);
        document.location.href = link;
      } else if(trailMaker == 1) {
        $(".trailMaker1").hide();
        $(".readyButton").show();
        var currentTimer = new Date();
        currentTimer = currentTimer.getTime();
        totalTime1 = currentTimer - timer;
        trailMaker++;
        number = 0;
      } else {
        $(".practiceExercise").hide();
        $(".readyButton").show();
        trailMaker++;
        number = 0;
      }
    }
    number++;
  } else {
    $(this).addClass("incorrect");
  }
});
$(".readyButton button").click(function() {
  $(".readyButton").hide();
  $(".trailMaker" + trailMaker).show();
  timer = new Date();
  timer = timer.getTime();
})
