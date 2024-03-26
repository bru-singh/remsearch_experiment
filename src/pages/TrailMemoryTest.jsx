import React, { useEffect, useRef, useMemo } from "react";
import { initJsPsych } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import htmlSliderResponse from '@jspsych/plugin-html-slider-response';
import surveyLikert from '@jspsych/plugin-survey-likert';
import surveyText from '@jspsych/plugin-survey-text';
import Movie from "./Movie";
import jStat from "jstat";
import { generateRandomList,shuffleArray } from "./functions";
import { sourceMemory } from "./sourceMemory";
function createFixation(trial_duration) {
  return {
    type: htmlKeyboardResponse,
    stimulus: `<p style="font-size: 48px;"> + </p>`,
    choices: "NO_KEYS",
    trial_duration: trial_duration,
  };
}
function JsPsychExperiment({
  participantId,
  checker,
  appearedWords,
  sourceMemory,
  vidIndArr,
  currWordSubInd,
  currWordInd,
  currVidInd,
  currVidSubInd,
  setAllTrials,
  allTrials,
  setIsTrail
}) {
  console.log("appeared words for the test are: ", appearedWords);
  const experimentDivId = 'trailWindow';
  const [isPlaying2, setIsPlaying2] = React.useState(false);
  const experimentDiv = useRef(null);
  const jsPsychOptions = {
    on_trial_finish: function (data) {
      console.log('A trial just ended, here are the latest data:',data);
    },
    default_iti: 250
  };
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    on_finish: (data) => {
      const trialData = {
        ...data.trials,
        "current_movie": `trial movie`,
        "stimuli_words": appearedWords
      }
      setAllTrials([...allTrials, trialData]);
      setIsTrail(false)
      console.log("Trial is finished, here is the overall data: ", trialData)
    },
  };

  const setUpJsPsych = () => {
    const jsPsych = initJsPsych(combinedOptions)
    jsPsych.data.addProperties({
      participant_id: participantId,
    })
    return jsPsych
  }
  const jsPsych = useMemo(setUpJsPsych,
    []
    [participantId]
  );

  let ans = 0
  let num1 = 0
  let num2 = 0
  // ------------------------------------------MATH QUESTIONS------------------------------------------------------------------------------
  var mathsTrials = function (temp) {  // generates math questions
    var possibleOperations = [" + ", " - "]
    var operation = jsPsych.randomization.sampleWithReplacement(possibleOperations, 1)[0]
    if (operation == " + ") {
      num1 = Math.floor(jStat.uniform.sample(10, temp))
      num2 = temp-num1;
    } else if (operation == " - ") {
      num1 = Math.floor(jStat.uniform.sample(temp, 50))
      num2 = num1-temp;
      ans = num1 - num2
    }
    return '<div style="font-size: 22px; font-weight: bolder;">' + num1 + operation + num2 + ' = </div>'
  }
  var temp_1 = Math.floor(jStat.uniform.sample(15, 45))
  var maths_test_1 = {
    type: surveyText,
    questions: [{prompt:function() {
      var stimuli = mathsTrials(temp_1);
      return stimuli;
    }, 
    name: "Math_distractor_task", 
    placeholder: "Response",
    required: true,
    columns: 9}],
    data: {"math_correct_ans": temp_1}
  };
  var temp_2 = Math.floor(jStat.uniform.sample(15, 45))
  var maths_test_2 = {
    type: surveyText,
    questions: [{prompt:function() {
      var stimuli = mathsTrials(temp_2);
      return stimuli;
    }, 
    name: "Math_distractor_task", 
    placeholder: "Response",
    required: true,
    columns: 9}],
    data: {"math_correct_ans": temp_2}
  };
  var temp_3 = Math.floor(jStat.uniform.sample(15, 45))
  var maths_test_3 = {
    type: surveyText,
    questions: [{prompt:function() {
      var stimuli = mathsTrials(temp_3);
      return stimuli;
    }, 
    name: "Math_distractor_task", 
    placeholder: "Response",
    required: true,
    columns: 9}],
    data: {"math_correct_ans": temp_3}
  };
  // ------------------------------------------FIXATIONS--------------------------------------------------------------------------------------
  var fixation = createFixation(750) // 750 ms
  var fixation_start = createFixation(1500) // 3 sec
  // ------------------------------------------MEMORY QUESTIONS-------------------------------------------------------------------------------
  var question_1 = {
    type: htmlKeyboardResponse,
    stimulus: `<div><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[0][0].word}</span><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[0][1].word}</span></div>`,
    choices: ["a", "d"], //left and right arrow key
    prompt: "<p>Which of the words appeared first?</p><p>Press the <span style='font-weight: bolder;'>A key</span> (for left) or <span style='font-weight: bolder;'>D key</span> (for right) to answer.</p>",
    response_ends_trial: true
  };
  var question_2 = {
    type: htmlSliderResponse,
    stimulus: `<div style="width:700px;">
            <div style="display: flex; justify-content: center">
              <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
              <p> ${appearedWords[0][0].word}</p>
              </div>
              <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
                <p>${appearedWords[0][1].word}</p>
              </div>
            </div>
            <p>What is the estimated time elapsed between them?</p>
          </div>`,
    require_movement: true,
    labels: ['0 Sec', '30 Sec', '1 Min', '1:30 Min'],
    step: 1,
    min: 0, //sec
    max: 90000, //sec
  }
  var question_3 = {
    type: htmlKeyboardResponse,
    stimulus: `<div><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[1][0].word}</span><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[1][1].word}</span></div>`,
    choices: ["a", "d"], //left and right arrow key
    prompt: "<p>Which of the words appeared first?</p><p>Press the <span style='font-weight: bolder;'>A key</span> (for left) or <span style='font-weight: bolder;'>D key</span> (for right) to answer.</p>",
    response_ends_trial: true
  };
  var question_4 = {
    type: htmlSliderResponse,
    stimulus: `<div style="width:700px;">
            <div style="display: flex; justify-content: center">
            <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
              <p> ${appearedWords[1][0].word}</p>
              </div>
              <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
                <p>${appearedWords[1][1].word}</p>
              </div>
            </div>
            <p>What is the estimated time elapsed between them?</p>
          </div>`,
    require_movement: true,
    labels: ['0 Sec', '30 Sec', '1 Min', '1:30 Min'],
    step: 1,
    min: 0, //sec
    max: 90000, //sec
  }
  var question_5 = {
    type: htmlKeyboardResponse,
    stimulus: `<div><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[2][0].word}</span><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[2][1].word}</span></div>`,
    choices: ["a", "d"], //A and D arrow keys
    prompt: "<p>Which of the words appeared first?</p><p>Press the <span style='font-weight: bolder;'>A key</span> (for left) or <span style='font-weight: bolder;'>D key</span> (for right) to answer.</p>",
    response_ends_trial: true
  };
  var question_6 = {
    type: htmlSliderResponse,
    stimulus: `<div style="width:700px;">
            <div style="display: flex; justify-content: center">
            <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
              <p> ${appearedWords[2][0].word}</p>
              </div>
              <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
                <p>${appearedWords[2][1].word}</p>
              </div>
            </div>
            <p>What is the estimated time elapsed between them?</p>
          </div>`,
    require_movement: true,
    labels: ['0 Sec', '30 Sec', '1 Min', '1:30 Min'],
    step: 1,
    min: 0, //sec
    max: 90000, //sec
  }
  var question_7 = {
    type: htmlKeyboardResponse,
    stimulus: `<div><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[3][0].word}</span><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[3][1].word}</span></div>`,
    choices: ["a", "d"], //A and D arrow keys
    prompt: "<p>Which of the words appeared first?</p><p>Press the <span style='font-weight: bolder;'>A key</span> (for left) or <span style='font-weight: bolder;'>D key</span> (for right) to answer.</p>",
    response_ends_trial: true
  };
  var question_8 = {
    type: htmlSliderResponse,
    stimulus: `<div style="width:700px;">
            <div style="display: flex; justify-content: center">
            <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
              <p> ${appearedWords[3][0].word}</p>
              </div>
              <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
                <p>${appearedWords[3][1].word}</p>
              </div>
            </div>
            <p>What is the estimated time elapsed between them?</p>
          </div>`,
    require_movement: true,
    labels: ['0 Sec', '30 Sec', '1 Min', '1:30 Min'],
    step: 1,
    min: 0, //sec
    max: 90000, //sec
  }
  // ------------------------------------------DEMOGRAPHICS AND MICS--------------------------------------------------------------------------------
  var scale = ['Not at all confident', 'Not very Confident', 'Confident', 'Very Confident'];
  var confidance_score = {
    type:surveyLikert,
    questions:[{
      prompt: "How confident are you in your response to the previous question?",
      labels: scale,
    }],
  }
  var realTask = {
    type: htmlKeyboardResponse,
    stimulus: `<div style="font-size: 22px; font-weight: bolder;">Great! Let's Move To The Experiment</div>`,
    choices: "NO_KEYS",
    trial_duration: 1500, // secs
  };

  // ------------------------------------------SOURCE MEMORY TEST------------------------------------------------------------------------------------
  let sourceListIndex = shuffleArray(generateRandomList(5, 1, 10));
  var score = 0;
  function generateRandomImageOrder_A_option(sourceListIndex, sourceMemory, i) {
    const checkingImages = `<img src="frames/trial/word${sourceListIndex[i]}/checking/${Math.floor(Math.random() * 3) + 1}.png" alt="display image" style="width:25vw" />`
    const correctImage = `<img src="frames/trial/word${sourceListIndex[i]}/word${sourceListIndex[i]}.png" alt="display image" style="width:25vw" />`
    const stimulusOrder = correctImage + '<div style="width:10px; display:inline-block;"></div>' + checkingImages;
    // Construct the stimulus HTML with dynamic image order
    const stimulusHTML = `${stimulusOrder}
                          <p style ="font-size: 24px;">Which scene was closer to the word <span style='font-weight: bolder;'>${sourceMemory[sourceListIndex[i]]}</span></p>
                          <p>Use the <span style='font-weight: bolder;'>A</span>(for left) or <span style='font-weight: bolder;'>D</span>(for right) keys</p>`;
    var sourceMemory_question = {
      type: htmlKeyboardResponse,
      stimulus: stimulusHTML,
      choices: ['a', 'd'],
      response_ends_trial: true,
      on_finish: function(data, flag){
        if(data.response === 'a'){
          score+=1;
        }
      }
    }
    return sourceMemory_question;
  }
  function generateRandomImageOrder_D_option(sourceListIndex, sourceMemory, i) {
    const checkingImages = `<img src="frames/trial/word${sourceListIndex[i]}/checking/${Math.floor(Math.random() * 3) + 1}.png" alt="display image" style="width:25vw" />`
    const correctImage = `<img src="frames/trial/word${sourceListIndex[i]}/word${sourceListIndex[i]}.png" alt="display image" style="width:25vw" />`
    const stimulusOrder = checkingImages + '<div style="width:10px; display:inline-block;"></div>' + correctImage;
    // Construct the stimulus HTML with dynamic image order
    const stimulusHTML = `${stimulusOrder}
                          <p style ="font-size: 24px;">Which scene was closer to the word <span style='font-weight: bolder;'>${sourceMemory[sourceListIndex[i]]}</span></p>
                          <p>Use the <span style='font-weight: bolder;'>A</span>(for left) or <span style='font-weight: bolder;'>D</span>(for right) keys</p>`;
    var sourceMemory_question = {
      type: htmlKeyboardResponse,
      stimulus: stimulusHTML,
      choices: ['a', 'd'],
      response_ends_trial: true,
      on_finish: function(data, flag){
        if(data.response === 'd'){
          score+=1;
        }
      }
    }
    return sourceMemory_question;
  }
  const sourceArr = [];
  for(let i = 0;i<5;i++){
    const flag = Math.floor(Math.random()*2);
    if(flag===0){
      var sourceTest = generateRandomImageOrder_A_option(sourceListIndex, sourceMemory, i);
    }
    else{var sourceTest = generateRandomImageOrder_D_option(sourceListIndex, sourceMemory, i);}
    sourceArr.push(sourceTest);
  }
  var sourceMemory_score = {
    type: htmlKeyboardResponse,
    stimulus: function () {
      console.log(score)
      if (score >= 3) {
        return `<div style="font-size: 32px; color: white; padding: 10px; border-radius: 5px;">
        Congratulations, you have scored ${score} out of 5 this round. Good job!
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #74d600; z-index: -1"></div>
      </div>`;
      } else {
        return `<div style="font-size: 32px; color: white; padding: 10px; border-radius: 5px;">
        Oh no, you have scored ${score} out of 5 this round. Better luck for the next round!
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #ff4545; z-index: -1"></div>
      </div>`;
      }
    },
    choices: ["NO_KEYS"],
    trial_duration: 3500,
  }
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------TIMELINE--------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------------
  const timeline_base = [
    fixation,
    maths_test_1,fixation, maths_test_2,fixation,maths_test_3,fixation,
    question_1, confidance_score,fixation, question_2,confidance_score, fixation,
    question_3, confidance_score,fixation, question_4,confidance_score, fixation,
    question_5, confidance_score,fixation, question_6,confidance_score, fixation,
    question_7, confidance_score,fixation, question_8,
  ]
  shuffleArray(sourceArr)
  const sourceTimeline = [
    fixation, sourceArr[0],confidance_score, fixation, sourceArr[1],confidance_score, fixation,
    sourceArr[2],confidance_score, fixation, sourceArr[3],confidance_score,fixation, sourceArr[4],confidance_score
  ]
  sourceTimeline.push(sourceMemory_score)
  console.log(sourceArr)
  sourceTimeline.push(realTask)
  let allowRedispatch = false;
  const handleKeyEvent = (e) => {
    if (allowRedispatch && !e.redispatched) {
      allowRedispatch = false; // Reset the flag
      e.redispatched = true; // Mark the event as redispatched
      experimentDiv.current.dispatchEvent(new KeyboardEvent(e.type, e));
    } else {
      allowRedispatch = true;
    }
  };
  
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
    // if(checker){timeline_base.push(...sourceTimeline)}
    jsPsych.run(timeline_base)
    // jsPsych.simulate(timeline_base, "data-only");
    // jsPsych.simulate(timeline, "visual");
    return () => {
      window.removeEventListener("keyup", handleKeyEvent, true);
      window.removeEventListener("keyadown", handleKeyEvent, true);
      jsPsych.endExperiment("Ended Experiment"); // No need for try/catch
    };
  }, []);

  return (
    <div className="App">

      {!isPlaying2 && <div id={experimentDivId} style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }} ref={experimentDiv} />}
      {isPlaying2 && <Movie dvidIndArr={vidIndArr} currVidInd={currVidInd} currVidSubInd={currVidSubInd} currWordInd={currWordInd} currWordSubInd={currWordSubInd} />}
    </div>
  );
}

export default JsPsychExperiment;