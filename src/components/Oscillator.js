import React, { useEffect, useState } from "react";

const Oscillator = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  // disable buttons based on audioContext state

  const [contextCreated, setContextCreated] = useState(false);

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
    setContextCreated(true);
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
      gainNode.gain.exponentialRampToValueAtTime(0.000001, currentTime + duration);
      setTimeout(() => {
        audioContext.suspend()
      }, duration * 1000)
    } else if (audioContext && audioContext.state !== "running") {
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(prevGainVal, currentTime + duration)
      setTimeout(() => {
        audioContext.resume()
      }, duration * 1000)
    }
    console.log("PAUSE", gainNode);
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
        setContextCreated(false);
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
        disabled={contextCreated}
        onClick={startAudioContext}
      >
        Start
      </button>
      <button id="stop-button" disabled={!contextCreated} onClick={pauseRes}>
        Res/Sus
      </button>
      <button
        id="stop-button"
        disabled={!contextCreated}
        onClick={stopAudioContext}
      >
        Stop
      </button>
    </div>
  );
};

export default Oscillator;
