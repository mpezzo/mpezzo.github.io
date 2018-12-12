
document.querySelector('button').addEventListener('click', e => 
	{
		if (Tone.context.state !== 'running') 
			{
				Tone.context.resume();
				alert('Playback resumed successfully');      
			 }; 
		});

function sequencer() {
  const kick = new Tone.Player("./drums/snare-vinyl01.wav").toMaster();
  const snare = new Tone.Player("./drums/snare-808.wav").toMaster();
  let index = 0;

  Tone.Transport.scheduleRepeat(repeat, "8n");
  Tone.Transport.start(+0.1);

  function repeat() {
    let step = index % 8;
    let kickInputs = document.querySelector(
      `.kick input:nth-child(${step + 1})`
    );
    let snareInputs = document.querySelector(
      `.snare input:nth-child(${step + 1})`
    );
    if (kickInputs.checked) {
      kick.start();
    }
    if (snareInputs.checked) {
      snare.start();
    }
    index++;
  }
}

sequencer();
