//BEGIN VARIABLES THAT SHOULD BE CHANGED BY USER
var kicks0 = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
var snares0 = [1,0,0,1,0,0,0,1,1,0,0,1,0,0,0,1];
var hihats0 = [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1];
var kicks1 = [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1];
var snares1 = [1,0,0,1,0,0,0,1,1,0,0,1,0,0,0,1];
var hihats1 = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
var kicks2 = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
var snares2 = [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1];
var hihats2 = [1,0,0,1,0,0,0,1,1,0,0,1,0,0,0,1];
var kicks3 = [1,0,0,1,0,0,0,1,1,0,0,1,0,0,0,1];
var snares3 = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
var hihats3 = [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1];
var startTempos = [200,60,200,60];
var patternChoice = 0;
var hideGrids = false;
var hideTempo = true;
var kickEnabled = true;
var snareEnabled = false;
var hihatEnabled = true;
var listenFirst = false;
var showGridsbool = 0;
var kickEnabledbool = 0;
var snareEnabledbool = 0;
var hihatEnabledbool = 0;
var listenFirstbool = 0;

if(!hideGrid) {
  showGridbool = 1;
} else {
  showGridbool = 0;
}
if(listenFirst) {
  listenFirstbool = 1;
} else {
  listenFirstbool = 0;
}
if(kickEnabled) {
  kickEnabledbool = 1;
} else {
  kickEnabledbool = 0;
}
if(snareEnabled) {
  snareEnabledbool = 1;
} else {
  snareEnabledbool = 0;
}
if(hihatEnabled) {
  hihatEnabledbool = 1;
} else {
  hihatEnabledbool = 0;
}

//END CHANGEABLE VARIABLES
hideGrid();
hideTempoButtons();
hideStartStop();
hideInstructions();
changeTempo(startTempos[trial - 1]);
function checkForm() {
  var ageGood = $("#age").val().length > 0;
  var sexGood = $("#sex option:selected").val().length > 0;
  var experienceGood = $("#experience").val().length > 0 && /^([1-9]|1[0])$/g.test($("#experience").val());
  var idGood = $("#id").val().length > 0;
  if(ageGood && sexGood && experienceGood && idGood) {
    showInstructions();
    showGrid();
    showStartStop();
    $(".information").hide();
  } else {
    hideGrid();
    hideTempoButtons();
    hideStartStop();
  }
}
$("#information").on("submit", function() {
  checkForm();
})
var trial1Data = '';
var trial2Data = '';
var trial3Data = '';
var trial4Data = '';
var time = 0;
var timeElapsed = 0;
var totalTimeElapsed = 0;
var tempoChanges = '';
var link = 'submit.php?';
$("#play-pause").click(function() {
  if($(this).hasClass("stopping")) {
    var timeStarted = new Date();
    timeStarted = timeStarted.toLocaleString();
    timeStarted = timeStarted.replace(/,/g, ";");
    var id = $("#id").val();
    var sex = $("#sex option:selected").val();
    var experience = $("#experience").val();
    var age = $("#age").val();
    if(timeElapsed == 0) {
      timeElapsed = "tempoDidntChange";
    }
    var currentTotalTime = new Date();
    currentTotalTime = currentTotalTime.getTime();
    totalTimeElapsed = currentTotalTime - totalTime;
    totalTimeElapsed = totalTimeElapsed / 1000;
    if(tempoChanges == '') {
      tempoChanges = startTempos[trial - 1];
    } else {
      tempoChanges = tempoChanges.slice(0, -1);
    }
    this["trial" + trial + "Data"] = id + ',' + trial + ',' + timeStarted + ',' + trial + ',' + listenFirstbool + ',' + timeElapsed + ',' + showGridsbool + "," + startTempos[trial - 1] + "," + tempo + "," + totalTimeElapsed + "," + age + "," + sex + ",blank1,blank2," + kickEnabledbool + ',' + snareEnabledbool + ',' + hihatEnabledbool + ',' + tempoChanges;
    if(trial < 4) {
      link += 'T' + trial + 'data=' + this["trial" + trial + "Data"] + "&";
    } else {
      link += 'T' + trial + 'data=' + this["trial" + trial + "Data"];
    }
    $(this).removeClass("stopping");
  }
  else {
    timeElapsed = 0;
    totalTimeElapsed = 0;
    time = new Date();
    time = time.getTime();
    $(this).addClass("stopping");
    tempoChanges = '';
    changeTempo(startTempos[trial - 1]);
    totalTime = new Date();
    totalTime = totalTime.getTime();
  }
})
var tempoFirst = true;
$("#play-pause").click(function() {
  if($(this).hasClass("stopping")) {
    tempoFirst = true;
  }
})
$("#decrease-tempo, #increase-tempo").click(function() {
  if(tempoFirst) {
    var currentTime = new Date();
    currentTime = currentTime.getTime();
    timeElapsed = currentTime - time;
    tempoFirst = false;
  }
  tempoChanges += tempo + ',';
})

//BEGIN CODE

//OLD LOOP
/*
UNCOMMENT THIS IN CASE OF EMERGENCY
var iKick = 0;
this["kicks" + patternChoice].forEach(function(kick) {
  if(kick == 1) {
    $(".kickrow .column_" + iKick).addClass("selected");
  }
  iKick++;
})
var iSnare = 0;
this["snares" + patternChoice].forEach(function(snare) {
  if(snare == 1) {
    $(".snarerow .column_" + iSnare).addClass("selected");
  }
  iSnare++;
})
var iHiHat = 0;
this["hihats" + patternChoice].forEach(function(hihat) {
  if(hihat == 1) {
    $(".hihatrow .column_" + iHiHat).addClass("selected");
  }
  iHiHat++;
})
*/

//COMPRESSED LOOP (New loop)
var instrumentNames = ['kick', 'snare', 'hihat'];
instrumentNames.forEach(function(instrument) {
  this["i" + instrument] = 0;
  this[instrument + "s" + patternChoice].forEach(function(binary) {
    if(binary == 1) {
      $("." + instrument + "row .column_" + this["i" + instrument]).addClass("selected");
    }
    this["i" + instrument]++;
  })
})
$(".changeSequence").click(function() {
  var sequence = $(this).attr("id") - 1;
  patternChoice = sequence;
  redoGrid();
})
function redoGrid() {
  var instrumentNames = ['kick', 'snare', 'hihat'];
  $(".selected").removeClass("selected");
  instrumentNames.forEach(function(instrument) {
    this["i" + instrument] = 0;
    this[instrument + "s" + patternChoice].forEach(function(binary) {
      if(binary == 1) {
        $("." + instrument + "row .column_" + this["i" + instrument]).addClass("selected");
      }
      this["i" + instrument]++;
    })
  })
}
function redoPattern(pattern) {
  var instrumentNames = ['kick', 'snare', 'hihat'];
  $(".selected").removeClass("selected");
  instrumentNames.forEach(function(instrument) {
    this["i" + instrument] = 0;
    this[instrument + "s" + pattern].forEach(function(binary) {
      if(binary == 1) {
        $("." + instrument + "row .column_" + this["i" + instrument]).addClass("selected");
      }
      this["i" + instrument]++;
    })
  })
}
//HIDE THE GRIDS
function hideGrid() {
  $(".kickrow, .hihatrow, .snarerow").hide();
}
if(hideGrids) {
  hideGrid();
}
function showGrid() {
  if(!kickEnabled) {
    $(".kickrow").hide();
    kicks0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    kicks1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    kicks2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    kicks3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  } else {
    $(".kickrow").show();
  }
  if(!snareEnabled) {
    $(".snarerow").css('display', 'none');
    snares0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    snares1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    snares2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    snares3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  } else {
    $(".snarerow").show();
  }
  if(!hihatEnabled) {
    $(".hihatrow").hide();
    hihats0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    hihats1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    hihats2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    hihats3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  } else {
    $(".hihatrow").show();
  }
  redoGrid();
}
function hideTempoButtons() {
  $("#decrease-tempo, #increase-tempo").hide();
}
function showTempoButtons() {
  $("#decrease-tempo, #increase-tempo").show();
}
function hideStartStop() {
  $("#play-pause").hide();
}
function showStartStop() {
  $("#play-pause").show();
}
function hideInstructions() {
  $(".instructions").hide();
}
function showInstructions() {
  $(".instructions").show();
}
if(hideTempo) {
  $("#tempo-input, .tempo-label").hide();
}
//END CODE
