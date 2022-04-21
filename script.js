/* global Tone */

// First, create the synth.
const synth = new Tone.Synth({
  oscillator: {
    type: "fatsine", // sine, square, triangle, sawtooth, fat*
  },
  envelope: {
    attack: 0.5,
    decay: 0.5,
    sustain: 1,
    release: 0.1,
  },
});
// Connect to the speakers.
synth.toMaster();
Tone.Transport.bpm.value = 120;

window.onmousedown = () => {
  // Play the melody!

  const melody = generate();
  play(melody);
};

// A – B – C# – D – E – F# – G#
const amajor = ["A3", "B3", "C#4", "D4", "E4", "F#4", "G#4"];
const aminor = ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "rest"];
const notes = aminor;

let degree = 0;

function generate() {
  // choose a starting place
  degree = randomInt(0, 8);

  // generate some measures
  const a = generateMeasures(2);
  const b = generateMeasures(2);
  const c = generateMeasures(2);

  // last note should be the tonic
  c[c.length - 2][0] = notes[2];
  c[c.length - 1][0] = notes[0];

  // arrange the measures and return
  return [].concat(a, b, a, c);
  
}

function generateMeasures(num) {
  const m = [];
  let lastNote;
  
  for (let i=0; i<num; i++){
    
    let timeLeft = Tone.Time("1m");
    
    while (timeLeft.toSeconds() > 0) {
      // choose note
 
      if(lastNote === "A3"){
        degree = Math.floor(Math.random()*aminor.length)
      } else {
        change = sample([-1, -1, 1, 1, -2, 2, 2, 2, 3, 3, -3, 4, -4]);
        degree = constrain(degree + change, 0, 6)
      }        

      const note = notes[degree];

      decision = Math.random();
      // choose length
      let length = Tone.Time("4n");
      if (decision < 0.2) {
        length = Tone.Time("2n");
      } else if (decision >= 0.2 && decision < 0.6){
        length = Tone.Time("8n");
      }
      if (length.toMilliseconds() > timeLeft.toMilliseconds()) {
        length = timeLeft;
      }
  
      // keep track of time
      timeLeft = Tone.Time(timeLeft - length);
  
      // add the note to the melody
      m.push([note, length]);
      lastNote = note
    }
  }

  return m;
}

function play(melody) {
  let t = Tone.now();
  for (const note of melody) {
    console.log(note[0], note[1].toNotation());
    if (note[0] !== "rest") {
      // synth.triggerAttackRelease(note[0], note[1]), t);
      synth.triggerAttackRelease(note[0], Tone.Time(note[1]) - 0.1, t);
    }
    t += Tone.Time(note[1]);
  }
}

console.log("click for music!");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function sample(data) {
  const index = Math.floor(Math.random(data.length));
  return data[index];
}

function constrain(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
