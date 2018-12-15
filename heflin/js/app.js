//GITHUB CONNECTION TEST.   TESTING...TESTING....


//audio node variables
var context;
var convolver;
var compressor;
var masterGainNode;
var effectLevelNode;
var lowPassFilterNode;

var noteTime;
var startTime;
var lastDrawTime = -1;
var LOOP_LENGTH = 16;
var rhythmIndex = 0;
var timeoutId;
var testBuffer = null;

var currentKit = null;
var reverbImpulseResponse = null;

var tempo = 120;
var TEMPO_MAX = 200;
var TEMPO_MIN = 40;
var TEMPO_STEP = 4;

function changeTempo(desiredTempo) {
  tempo = desiredTempo;
  $("#tempo-input").val(tempo);
}

if (window.hasOwnProperty('AudioContext') && !window.hasOwnProperty('webkitAudioContext')) {
  window.webkitAudioContext = AudioContext;
}

$(function() {
  init();
  toggleSelectedListener();
  playPauseListener();
  initializeTempo();
  changeTempoListener();
});
function changeFrequency(event, ui) {
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  var multiplier = Math.pow(2, numberOfOctaves * (ui.value - 1.0));
  lowPassFilterNode.frequency.value = maxValue * multiplier;
}

function changeQuality(event, ui) {
  //30 is the quality multiplier, for now.
  lowPassFilterNode.Q.value = ui.value * 30;
}

function playPauseListener() {
  $('#play-pause').click(function() {
    var $span = $(this).children("span");
    if($span.hasClass('startSequencer')) {
      $span.removeClass('startSequencer');
      $span.addClass('stopSequencer');
      handlePlay();
    }
    else {
      $span.addClass('startSequencer');
      $span.removeClass('stopSequencer');
      handleStop();
    }
  });
}

function toggleSelectedListener() {
  //$('.pad').click(function() {
    //$(this).toggleClass("selected");
  //});
}

function init() {
  initializeAudioNodes();
  loadKits();
  loadImpulseResponses();
}

function initializeAudioNodes() {
  context = new webkitAudioContext();
  var finalMixNode;
  if (context.createDynamicsCompressor) {
      // Create a dynamics compressor to sweeten the overall mix.
      compressor = context.createDynamicsCompressor();
      compressor.connect(context.destination);
      finalMixNode = compressor;
  } else {
      // No compressor available in this implementation.
      finalMixNode = context.destination;
  }


  // Create master volume.
  // for now, the master volume is static, but in the future there will be a slider
  masterGainNode = context.createGain();
  masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
  masterGainNode.connect(finalMixNode);

  //connect all sounds to masterGainNode to play them

  //don't need this for now, no wet dry mix for effects
  // // Create effect volume.
  // effectLevelNode = context.createGain();
  // effectLevelNode.gain.value = 1.0; // effect level slider controls this
  // effectLevelNode.connect(masterGainNode);

  // Create convolver for effect
  convolver = context.createConvolver();
  convolver.active = false;
  // convolver.connect(effectLevelNode);

  //Create Low Pass Filter
  lowPassFilterNode = context.createBiquadFilter();
  //this is for backwards compatibility, the type used to be an integer
  lowPassFilterNode.type = (typeof lowPassFilterNode.type === 'string') ? 'lowpass' : 0; // LOWPASS
  //default value is max cutoff, or passing all frequencies
  lowPassFilterNode.frequency.value = context.sampleRate / 2;
  lowPassFilterNode.connect(masterGainNode);
  lowPassFilterNode.active = false;
}

function loadKits() {
  //name must be same as path
  var kit = new Kit("");
  kit.load();

  //TODO: figure out how to test if a kit is loaded
  currentKit = kit;
}

function loadImpulseResponses() {
  //reverbImpulseResponse = new ImpulseResponse("sounds/impulse-responses/matrix-reverb2.wav");
  //reverbImpulseResponse.load();
}


//TODO delete this
function loadTestBuffer() {
  var request = new XMLHttpRequest();
  var url = "http://www.freesound.org/data/previews/102/102130_1721044-lq.mp3";
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    context.decodeAudioData(
      request.response,
      function(buffer) {
        testBuffer = buffer;
      },
      function(buffer) {
        console.log("Error decoding drum samples!");
      }
    );
  }
  request.send();
}

//TODO delete this
function sequencePads() {
  $('.pad.selected').each(function() {
    $('.pad').removeClass("selected");
    $(this).addClass("selected");
  });
}

function playNote(buffer, noteTime) {
  var voice = context.createBufferSource();
  voice.buffer = buffer;

  var currentLastNode = masterGainNode;
  if (lowPassFilterNode.active) {
    lowPassFilterNode.connect(currentLastNode);
    currentLastNode = lowPassFilterNode;
  }
  if (convolver.active) {
    convolver.buffer = reverbImpulseResponse.buffer;
    convolver.connect(currentLastNode);
    currentLastNode = convolver;
  }

  voice.connect(currentLastNode);
  voice.start(noteTime);
}

function schedule() {
  var currentTime = context.currentTime;

  // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
  currentTime -= startTime;

  while (noteTime < currentTime + 0.200) {
      var contextPlayTime = noteTime + startTime;
      var $currentPads = $(".column_" + rhythmIndex);
      $currentPads.each(function() {
        if ($(this).hasClass("selected")) {
          var instrumentName = $(this).parents().data("instrument");
          switch (instrumentName) {
          case "kick":
            playNote(currentKit.kickBuffer, contextPlayTime);
            break;
          case "snare":
            playNote(currentKit.snareBuffer, contextPlayTime);
            break;
          case "hihat":
            playNote(currentKit.hihatBuffer, contextPlayTime);
            break;
        }
          //play the buffer
          //store a data element in the row that tells you what instrument
        }
      });
      if (noteTime != lastDrawTime) {
          lastDrawTime = noteTime;
          drawPlayhead(rhythmIndex);
      }
      advanceNote();
  }

  timeoutId = requestAnimationFrame(schedule)
}

function drawPlayhead(xindex) {
    var lastIndex = (xindex + LOOP_LENGTH - 1) % LOOP_LENGTH;

    //can change this to class selector to select a column
    var $newRows = $('.column_' + xindex);
    var $oldRows = $('.column_' + lastIndex);

    $newRows.addClass("playing");
    $oldRows.removeClass("playing");
}

function advanceNote() {
    // Advance time by a 16th note...
    // var secondsPerBeat = 60.0 / theBeat.tempo;
    //TODO CHANGE TEMPO HERE, convert to float
    tempo = Number($("#tempo-input").val());
    var secondsPerBeat = 60.0 / tempo;
    rhythmIndex++;
    if (rhythmIndex == LOOP_LENGTH) {
        rhythmIndex = 0;
    }

    //0.25 because each square is a 16th note
    noteTime += 0.25 * secondsPerBeat
    // if (rhythmIndex % 2) {
    //     noteTime += (0.25 + kMaxSwing * theBeat.swingFactor) * secondsPerBeat;
    // } else {
    //     noteTime += (0.25 - kMaxSwing * theBeat.swingFactor) * secondsPerBeat;
    // }

}
var trial = 1;
function handlePlay(event) {
  if(trial <= 4) {
    rhythmIndex = 0;
    noteTime = 0.0;
    startTime = context.currentTime + 0.005;
    schedule();
    $("#startStopButton").text("WAIT 5 SECONDS...");
    $("#play-pause").css("pointer-events", "none");
    if(listenFirst) {
      setTimeout(function() {
        showTempoButtons();
        $("#play-pause").css("pointer-events", "auto");
        $("#startStopButton").text("STOP TRIAL " + trial);
      }, 5000);
    } else {
      showTempoButtons();
      $("#play-pause").css("pointer-events", "auto");
      $("#startStopButton").text("STOP TRIAL " + trial);
    }
  }
  else {
    handleStop();
  }
}
function handleStop(event) {
  hideTempoButtons();
  var ageGood = $("#age").val().length > 0;
  var sexGood = $("#sex option:selected").val().length > 0;
  var experienceGood = $("#experience").val().length > 0;
  var idGood = $("#id").val().length > 0;
  if(trial == 4) {
    if(ageGood && sexGood && experienceGood && idGood) {
      $(".container").hide();
      $(".container2").show();
    } else {
      $("#startStopButton").removeClass("startSequencer").text("DONE");
      hideGrid();
      hideTempoButtons();
      alert("It appears that you're missing one or more pieces of information in the form elements that were provided. Please enter the missing information and then press the 'DONE' button.");
    }
  } else {
    trial++;
    redoPattern(trial - 1);
    $("#startStopButton").text("START TRIAL " + trial);
  }
  cancelAnimationFrame(timeoutId);
  $(".pad").removeClass("playing");
}

function initializeTempo() {
  $("#tempo-input").val(tempo);
}

function changeTempoListener() {
  $("#increase-tempo").click(function() {
    if (tempo < TEMPO_MAX) {
      tempo += TEMPO_STEP;
      $("#tempo-input").val(tempo);
    }
  });

  $("#decrease-tempo").click(function() {
    if (tempo > TEMPO_MIN) {
      tempo -= TEMPO_STEP;
      $("#tempo-input").val(tempo);
    }
  });
}
