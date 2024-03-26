import React, { useEffect, useRef, useMemo, useState } from "react";
import { initJsPsych } from 'jspsych'
import instructions from '@jspsych/plugin-instructions';
import '@jspsych/plugin-survey/css/survey.css'
import surveyText from '@jspsych/plugin-survey-text';
import TrailMovie from "./TrailMovie";

function IntroPage({
    vidIndArr,
    currVidInd,
    currVidSubInd,
    currWordInd,
    currWordSubInd,
    
    setCurrVidInd,
    setCurrVidSubInd,
    setCurrWordInd,
    setCurrWordSubInd,
    setIsIntro,
    allTrials,
    setAllTrials,
    checker,

    participantId,
    setParticipantId
}){
  console.log("participant ID in intro.js: ", participantId);
  const [isplaying, setIsplaying] = useState(false);
  const experimentDiv = useRef(null);
  const experimentDivId = "introWindow";
  const jsPsychOptions = {
    on_trial_finish: () => {}, // Empty for now
    default_iti: 250,
    display_element: "introWindow",
    on_finish: (data) => {
      console.log("ID is:",data.trials[0].response.participant_id);
      console.log("overall data:", [...allTrials, data.trials]);
      console.log("Timeline finished, overall data:", data);
      setParticipantId(data.trials[0].response.participant_id.toString());
      setIsplaying(true);
      setIsIntro(false);
      setAllTrials([...allTrials, data.trials]);
    },
  };
  // Use useMemo for efficient initialization
  const jsPsych = useMemo(() => initJsPsych(jsPsychOptions), [participantId]);
  var instruction ={
      type: instructions,
      pages:[ `<div style="font-size: 22px; margin: 20px 10px; text-align: center;">
                Welcome, and thank you for participating in our behavioral cognitive science research study.<br>
                If you have any questions or concerns, please do not hesitate to ask.<br>
                </div>`,
              `<div style="font-size: 22px; margin: 20px 10px; text-align: center;">
              In this experiment, you will watch videos and words that appear on top of the videos.<br>
                Later, you will be asked questions based on the video and the words shown.
                </div>`,
                `<div style="font-size: 22px; margin: 20px 10px; text-align: center;">
                Keep your <span style="font-weight: bold">left</span> hand on the <span style="font-weight: bold">A</span> and <span style="font-weight: bold">D</span> keys<br>
                and your <span style="font-weight: bold">right</span> hand on the <span style="font-weight: bold">mouse</span> throughout the experiment.<br>
                Press them as soon as you feel you know the answer.
                </div>`,
              `<div style="font-size: 22px; margin: 20px 10px; text-align: center;">
              Let's have a trial round first.<brd>
              <span style="font-weight: bold">Continue</span> to start the experiment.
              </div>`],
      button_label_next: "Continue",
      show_clickable_nav: true,
      button_label_previous: "Previous",        
      allow_backward: true,
      allow_keys: true,
  }
  var id ={
      type: surveyText,
      questions: [{prompt: 'Participant ID:',name: 'participant_id',placeholder: "Participant ID",required: true, columns: '20'}],
      button_label_finish: 'Continue',
  }
  const timeline=[id,instruction]

  useEffect(() => {
    let allowRedispatch = false;
    const handleKeyEvent = (e) => {
      if (allowRedispatch && !e.redispatched) {
        allowRedispatch = false; // Reset the flag
        e.redispatched = true; // Mark the event as redispatched
        // experimentDiv.current.dispatchEvent(new KeyboardEvent(e.type, e));
      } else {
        allowRedispatch = true;
      }
    };

    window.addEventListener("keyup", handleKeyEvent, true);
    window.addEventListener("keydown", handleKeyEvent, true);

    jsPsych.run(timeline);

    return () => {
      window.removeEventListener("keyup", handleKeyEvent, true);
      window.removeEventListener("keyadown", handleKeyEvent, true);
      jsPsych.endExperiment("Ended Experiment");
    };
  }, []);
  return (
   <div className="App">
        <div id={experimentDivId} style={{
          display: "flex",
          justifyContent: "center", 
          alignItems: "center",
          height: "100vh"
        }} ref={experimentDiv} />
        {isplaying && <TrailMovie setIsIntro={setIsIntro} vidIndArr = {vidIndArr} currVidInd={currVidInd} currVidSubInd={currVidSubInd} currWordInd={currWordInd} currWordSubInd={currWordSubInd}
    setCurrVidInd={setCurrVidInd} setCurrVidSubInd={setCurrVidSubInd} setCurrWordInd={setCurrWordInd} setCurrWordSubInd={setCurrWordSubInd} checker ={checker} allTrials={allTrials} setAllTrials={setAllTrials}
    participantId={participantId}/>}
    </div>
  );
}
export default IntroPage;