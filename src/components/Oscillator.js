import React, { useEffect, useState } from "react";

const Oscillator = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  // disable buttons based on audioContext state
  const [disabledStart, setDisabledStart] = useState(false);
  const [disabledStop, setDisabledStop] = useState(true);
  const [disabledResSus, setDisabledResSus] = useState(true);

  const startAudioContext = () => {
    const newAudioContext = new AudioContext();
    // create oscillator node and gain node
    const osc = new OscillatorNode(newAudioContext, {
      type: "sine",
      frequency: 110, // value in herz
    });
    const newGainNode = new GainNode(newAudioContext, { gain: 0.1 });
    // connect oscillator and gain to speaker output
    osc.connect(newGainNode);
    newGainNode.connect(newAudioContext.destination);

    osc.start();
    setDisabledStart(true);
    setDisabledResSus(false);
    setDisabledStop(false);

    // pass audioContext to useState to make it available globally in the component
    setAudioContext(newAudioContext);
    setGainNode(newGainNode)
    console.log("GainNode:", gainNode);
    // return;
  };

  const pauseRes = () => {
    // if audioContext currently is true (exists) and state is running
    const currentTime = audioContext.currentTime;
    const duration = 0.04;
    const prevGainVal = gainNode.gain.value;
    if (audioContext && audioContext.state === "running") {
      
      // set fade from gain value at current time and duration of fade
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, currentTime + duration);
      setTimeout(() => {
        audioContext.suspend()
      }, duration * 1000)
    } else if (audioContext && audioContext.state !== "running") {
      // gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(prevGainVal, currentTime + duration);
      setTimeout(() => {
        audioContext.resume()
      }, duration * 1000)
    }
    console.log("PAUSE", prevGainVal);

  };

  const stopAudioContext = () => {

    if (audioContext) {
    const currentTime = audioContext.currentTime;
    const duration = 0.04;
    
    // set fade from gain value at current time and duration of fade
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, currentTime + duration);
    // if audioContext currently is true (exists) and state is running
    setTimeout(() => {
      audioContext.close().then(() => {
        setDisabledStart(false);
        setDisabledResSus(true);
        setDisabledStop(true);
        setAudioContext(null);
        console.log("GainNode:", gainNode);
      });
    }, duration * 1000) // convert duration to milliseconds
    }
  };

  return (
    <div>
      <button
        id="start-button"
        disabled={disabledStart}
        onClick={startAudioContext}
      >
        Start
      </button>
      <button id="stop-button" disabled={disabledStop} onClick={pauseRes}>
        Res/Sus
      </button>
      <button
        id="stop-button"
        disabled={disabledResSus}
        onClick={stopAudioContext}
      >
        Stop
      </button>
    </div>
  );
};

export default Oscillator;
