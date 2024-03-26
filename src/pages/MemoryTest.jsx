// _______________________________________________________ IMPORTS ________________________________________________________
import React, { useEffect,useState, useRef, useMemo } from "react";
import { initJsPsych } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import htmlSliderResponse from '@jspsych/plugin-html-slider-response';
import surveyText from '@jspsych/plugin-survey-text';
import surveyLikert from '@jspsych/plugin-survey-likert';
import '@jspsych/plugin-survey/css/survey.css'
import survey from '@jspsych/plugin-survey';
import jStat from "jstat";
import { generateRandomList,shuffleArray,handleSave} from "./functions";
function createFixation(trial_duration) {
  return {
    type: htmlKeyboardResponse,
    stimulus: `<p style="font-size: 48px;"> + </p>`,
    choices: "NO_KEYS",
    trial_duration: trial_duration,
  };
}
// Main experiment function
function JsPsychExperiment({
  participantId,
  checker,
  appearedWords,
  sourceMemory,
  setIsPlaying,
  vidIndArr,
  currWordSubInd,
  currWordInd,
  currVidInd,
  currVidSubInd,
  setvidIndArr,
  setCurrVidInd,
  setCurrVidSubInd,
  setCurrWordInd,
  setCurrWordSubInd,
  setAllTrials,
  allTrials,
  setRedirectToEndPage
}) {
  console.log(
    "vidIndArr:",vidIndArr,
    "currVidInd: ",currVidInd,
    "currVidSubInd: ",currVidSubInd,
    "currWordInd: ",currWordInd,
    "currWordSubInd",currWordSubInd)
  console.log("stimuli list is: ", appearedWords);

  const experimentDivId = 'experimentWindow';
  const [isPlaying2, setIsPlaying2] = React.useState(false);
  const experimentDiv = useRef(null);
  const jsPsychOptions = {
    on_trial_finish: function (data) {
      console.log('A trial just ended, here are the latest data:',data);
      console.log(data);
    },
    default_iti: 500
  };
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    // on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => {
      const trialData = {
        ...data.trials,
        "current_movie": `${currVidInd + 1}_${currVidSubInd + 1}`,
        "stimuli_words": appearedWords
      }
      setAllTrials([...allTrials, trialData]);
      console.log("Trial is finished, here is the overall data: ", trialData)
      console.log("currVidInd: ", currVidInd)
      if (currVidSubInd >= 3) {
        setCurrVidSubInd(0);
        if (vidIndArr.length > 0) {
          handleSave(`participant_${participantId}_movie_${currVidInd+1}_data.json`,[...allTrials, trialData])
          let ind = parseInt(Math.random() * 100) % vidIndArr.length;
          setCurrVidInd(vidIndArr[ind]);
          vidIndArr.splice(ind, 1); 
          if (currWordInd < 2)
            setCurrWordInd(currWordInd + 1);
          setCurrWordSubInd(0);
          // setCurrVidInd
        }
        else {
          // experiment ended
          console.log("experiment ended")
          handleSave(`participant_${participantId}_overall_data.json`,[...allTrials, trialData])
          setIsPlaying(false)
          setRedirectToEndPage(true);
          // redirect to the end page
        }
      }
      else {
        setCurrVidSubInd(currVidSubInd + 1);
        console.log("currWordSubInd is:", currWordSubInd)
        if (currWordSubInd <= 15) //words_per_trails
          setCurrWordSubInd(currWordSubInd + 1);
          setIsPlaying(true);
        // console.log("Video: ", currVidInd, "_", currVidSubInd, "from the else loop")
      }
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
  var fixation_start = createFixation(1500) // 1.5 sec
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
  var question_9 = {
    type: htmlKeyboardResponse,
    stimulus: `<div><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[4][0].word}</span><span style='font-size: 22px; font-weight: bolder; margin: 0px 40px'>${appearedWords[4][1].word}</span></div>`,
    choices: ["a", "d"], //A and D arrow keys
    prompt: "<p>Which of the words appeared first?</p><p>Press the <span style='font-weight: bolder;'>A key</span> (for left) or <span style='font-weight: bolder;'>D key</span> (for right) to answer.</p>",
    response_ends_trial: true
  };
  var question_10 = {
    type: htmlSliderResponse,
    stimulus: `<div style="width:700px;">
            <div style="display: flex; justify-content: center">
            <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
              <p> ${appearedWords[4][0].word}</p>
              </div>
              <div style="margin: 0 50px; font-size: 22px; font-weight: bolder;">
                <p>${appearedWords[4][1].word}</p>
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
  var between_movies = {
    type: htmlKeyboardResponse,
    stimulus: `<div style="font-size: 22px;">Congratulations, you have completed this part. Take a Break, Press <span style='font-weight: bolder;'>SPACEBAR</span> when you are ready</div>`,
    choices: [" "],
    response_ends_trial: true
  }
  var scale = ['Not at all confident', 'Not very Confident', 'Confident', 'Very Confident'];
  var confidance_score = {
    type:surveyLikert,
    questions:[{
      prompt: "How confident are you in your response to the previous question?",
      labels: scale,
    }],
  }
  var confidance_score_memory_test = {
    type:surveyLikert,
    questions:[
    {
      prompt: "How confident are you in your response to the previous question?",
      labels: scale
    }
    ],
  }
  var demographic ={
    type: survey,
    pages:[
      [
        {type: 'text',prompt: 'Age: ',name:'age',required: true},
        {type: 'drop-down',prompt: 'Gender: ',name:'gender',options: ['Male','Female','Others'], required: true},
        {type: 'drop-down',prompt: 'Program: ',name:'program',options: ['B.Tech','Dual Degree','M.S', 'M.Tech', 'PHD', 'CASE', 'Other'], required: true},
      ],
      [
        {type: 'text',prompt: 'Tell us the strategies you used to do the tasks: ',name:'strategies', required: true,textbox_rows: 3},
        {type: 'text',prompt: 'Any feedback about the experiment', name: 'feedback', required: false, textbox_rows: 3}
      ]
    ],
    title:"Thanks for participating, please fill out your details",
    button_label_next: 'Continue',
    button_label_back: 'Previous',
    button_label_finish: 'Submit',
  }
  const demographicTimeline = [demographic]

  // ------------------------------------------SOURCE MEMORY TEST------------------------------------------------------------------------------------
  let sourceListIndex = shuffleArray(generateRandomList(5, 1, 13));
  var score = 0;
  if (currVidInd==2){
    sourceListIndex = shuffleArray(generateRandomList(5,1,8));
  }
  function generateRandomImageOrder_A_option(currVidInd, currVidSubInd, sourceListIndex, sourceMemory, i) {
    const checkingImages = `<img src="frames/movie${currVidInd+1}/movie${currVidInd+1}_${currVidSubInd+1}/word${sourceListIndex[i]}/checking/${Math.floor(Math.random() * 3) + 1}.png" alt="display image" style="width:25vw" />`
    const correctImage = `<img src="frames/movie${currVidInd+1}/movie${currVidInd+1}_${currVidSubInd+1}/word${sourceListIndex[i]}/word${sourceListIndex[i]}.png" alt="display image" style="width:25vw" />`
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
  function generateRandomImageOrder_D_option(currVidInd, currVidSubInd, sourceListIndex, sourceMemory, i) {
    const checkingImages = `<img src="frames/movie${currVidInd+1}/movie${currVidInd+1}_${currVidSubInd+1}/word${sourceListIndex[i]}/checking/${Math.floor(Math.random() * 3) + 1}.png" alt="display image" style="width:25vw" />`
    const correctImage = `<img src="frames/movie${currVidInd+1}/movie${currVidInd+1}_${currVidSubInd+1}/word${sourceListIndex[i]}/word${sourceListIndex[i]}.png" alt="display image" style="width:25vw" />`
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
      var sourceTest = generateRandomImageOrder_A_option(currVidInd, currVidSubInd, sourceListIndex, sourceMemory, i);
    }
    else{var sourceTest = generateRandomImageOrder_D_option(currVidInd, currVidSubInd, sourceListIndex, sourceMemory, i);}
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
    fixation_start,
    maths_test_1, fixation, maths_test_2, fixation, maths_test_3, fixation,
    question_1,confidance_score_memory_test, fixation, question_2,confidance_score_memory_test, fixation,
    question_3,confidance_score_memory_test, fixation, question_4,confidance_score_memory_test, fixation,
    question_5,confidance_score_memory_test, fixation, question_6,confidance_score_memory_test, fixation,
    question_7,confidance_score_memory_test, fixation, question_8,confidance_score_memory_test, fixation,
    question_9,confidance_score_memory_test, fixation, question_10,confidance_score_memory_test
  ]
  shuffleArray(sourceArr)
  console.log(sourceArr)

  const sourceTimeline = [
    fixation, sourceArr[0],confidance_score, fixation, sourceArr[1],confidance_score, fixation,
    sourceArr[2],confidance_score, fixation, sourceArr[3],confidance_score,fixation, sourceArr[4],confidance_score
  ]
  sourceTimeline.push(sourceMemory_score)
  const handleKeyEvent = e => {
    if (e.redispatched) {
      return;
    }
    let new_event = new e.constructor(e.type, e);
    new_event.redispatched = true;
    experimentDiv.current.dispatchEvent(new_event);
  };
  
  useEffect(() => {
    window.addEventListener("keyup", handleKeyEvent, true);
    window.addEventListener("keydown", handleKeyEvent, true);
    if(checker){timeline_base.push(...sourceTimeline)}
    if(currVidSubInd==3){
      if(vidIndArr.length>0)timeline_base.push(between_movies)
      else timeline_base.push(...demographicTimeline)
    }
    jsPsych.run(timeline_base)
    // jsPsych.simulate(timeline_base, "data-only");
    // jsPsych.simulate(timeline, "visual");


    return () => {
      window.removeEventListener("keyup", handleKeyEvent, true);
      window.removeEventListener("keydown", handleKeyEvent, true);
      try {
        jsPsych.endExperiment("Ended Experiment");
      } catch (e) {
        console.error("Experiment closed before unmount");
      }
    };
  }, []);

  return (
    <div className="App">
    {!isPlaying2 && (
      <div id={experimentDivId} style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }} ref={experimentDiv} />
    )}
  </div>
  );
}

export default JsPsychExperiment;