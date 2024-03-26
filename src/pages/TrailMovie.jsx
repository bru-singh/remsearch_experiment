// import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import "../App.css";
import Keyb from "./TrailMemoryTest.jsx";
import movie from "../data/test_video.mp4";
import {randomize, trial_wordlist, getRandomInt, make_stimuli} from "./functions.jsx";

var timeperword = 2000; // 2 secs
var fixation = '+';
const wordlist = randomize(trial_wordlist)
console.log(wordlist)
function TrailMovie({
  vidIndArr,
  currVidInd,
  currVidSubInd,
  currWordInd,
  currWordSubInd,

  setvidIndArr,
  setCurrVidInd,
  setCurrVidSubInd,
  setCurrWordInd,
  setCurrWordSubInd,
  setAllTrials,
  
  allTrials,
  checker ={checker} ,
  setIsTrail,
  participantId
}) {
  const [currentVideo, setCurrentVideo] = useState(movie);
  const [isPlaying,setIsPlaying] = useState(true);
  const [word, setWord] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [plus, setPlus] = useState(false);
  let [currWordSubSubInd, setCurrWordSubSubInd] = useState(0);
  const currentList = [];
  const [appearedWords, setAppearedWords] = useState([]);
  const time1 = 22; //smaller interval
  const time2 = 68;  //larger interval
  useEffect(() => {
    setCurrentVideo(movie);
    setIsPlaying(true);
  }, ([currWordInd, currWordSubInd]));

  useEffect(() => {
    const vid = document.getElementById("video-player");
    let last = 0;
    let lastShowPopupTime = 0;
    vid.addEventListener("timeupdate", (event) => {
      const tick = Math.floor(vid.currentTime);
      const diff = tick - lastShowPopupTime
      if (tick != last && diff == 6 && tick <=100 ) {
        const currentWord = wordlist[currWordInd][currWordSubInd];
        setWord(currentWord);
        currWordSubInd += 1;
        setPlus(true);
        setTimeout(() => {
          setTimeout(() => {
            let start_time = vid.currentTime; // Record the start timestamp when the word appears
            setShowPopup(true);
            setTimeout(() => {
              setShowPopup(false);
              let end_time = vid.currentTime; // Record the end timestamp when the word disappears
              console.log("Word timings:", { word: currentWord, start: start_time, end: end_time });
              currentList.push({ word: currentWord, start: start_time, end: end_time });
            }, timeperword);
          }, 250); // time between "+" jitter and word stimuli
          setPlus(false);
        }, 625 + getRandomInt(-125, 125)); // maths_jitter_interval
        last = tick;
        lastShowPopupTime = tick + 2
      }
    });
    vid.addEventListener("ended", () => {
      console.log("trail ended")
      setAppearedWords(currentList);
      setIsPlaying(false)
    });
  }, [currentVideo])
 

  return (
    <div style={{ position: "relative" }}>
      { !isPlaying && <Keyb setIsTrail={setIsTrail} vidIndArr = {vidIndArr} setvidIndArr={setvidIndArr} currVidInd={currVidInd} setCurrVidInd={setCurrVidInd} 
      currVidSubInd={currVidSubInd} setCurrVidSubInd={setCurrVidSubInd} setIsPlaying={setIsPlaying} 
      currWordInd={currWordInd} setCurrWordInd={setCurrWordInd} currWordSubInd={currWordSubInd} setCurrWordSubInd={setCurrWordSubInd}
      allTrials={allTrials} setAllTrials={setAllTrials} sourceMemory={wordlist[currWordInd]} appearedWords={make_stimuli(appearedWords, time1, time2)} checker ={checker}
      />}
     { isPlaying && <div><video
        src={currentVideo}
        id="video-player" 
        style={{ height: "100vh", width: "100vw" }}
        autoPlay
        muted
      />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "40px",
            zIndex: "200",
            display: showPopup ? "block" : "none",
            fontSize: "3.5rem",
            borderRadius: "20px",
            transition: "1s ease all",
          }}
        >
          {word}
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "40px",
            zIndex: "200",
            display: plus ? "block" : "none",
            fontSize: "3.5rem",
            borderRadius: "20px",
            transition: "1s ease all",
          }}
        >
          {fixation}
        </div>
      </div>}
    </div>  
  );
}

export default TrailMovie;
