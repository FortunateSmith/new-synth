import React, { useEffect, useState } from "react";

const Oscillator = () => {
  const [audioContext, setAudioContext] = useState(null);
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
    const gainNode = new GainNode(newAudioContext, { gain: 0.1 });
    // connect oscillator and gain to speaker output
    osc.connect(gainNode);
    gainNode.connect(newAudioContext.destination);

    osc.start();
    setDisabledStart(true);
    setDisabledResSus(false);
    setDisabledStop(false);

    // pass audioContext to useState to make it available globally in the component
    setAudioContext(newAudioContext);
    console.log("STATE:", newAudioContext);
    // return;
  };

  const toggleRun = () => {
    if (running === true) {
      audioContext.suspend().then(() => {
        setRunning(false);
      });
    } else {
    }
  };

  const stopAudioContext = () => {
    if (audioContext && audioContext.state === "running") {
      audioContext.close().then(() => {
        setDisabledStart(false);
        setDisabledResSus(true);
        setDisabledStop(true);
        setAudioContext(null);
      });
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
      <button id="stop-button" disabled={disabledStop} onClick={toggleRun}>
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
