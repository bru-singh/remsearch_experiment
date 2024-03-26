// import logo from './logo.svg';
import '../App.css';
import { useEffect, useState, useCallback } from "react";
import Keyb from  './MemoryTest.jsx'
import movie1_1 from "../data/movie1/movie1_1.mp4";
import movie1_2 from "../data/movie1/movie1_2.mp4";
import movie1_3 from "../data/movie1/movie1_3.mp4";
import movie1_4 from "../data/movie1/movie1_4.mp4";

import movie2_1 from "../data/movie2/movie2_1.mp4";
import movie2_2 from "../data/movie2/movie2_2.mp4";
import movie2_3 from "../data/movie2/movie2_3.mp4";
import movie2_4 from "../data/movie2/movie2_4.mp4";

import movie3_1 from "../data/movie3/movie3_1.mp4";
import movie3_2 from "../data/movie3/movie3_2.mp4";
import movie3_3 from "../data/movie3/movie3_3.mp4";
import movie3_4 from "../data/movie3/movie3_4.mp4";
import {randimze, randomize_wordList, wordlist, getRandomInt, make_stimuli} from "./functions.jsx";

// import randomize from "./TrailMovie";
const movie1 = [movie1_1,movie1_2,movie1_3,movie1_4]
const movie2 = [movie2_1,movie2_2,movie2_3,movie2_4]
const movie3 = [movie3_1,movie3_2,movie3_3,movie3_4]
const movies = [movie1, movie2, movie3]
const total_movies =  [movie1_1,movie1_2,movie1_3,movie1_4,movie2_1,movie2_2,movie2_3,movie2_4,movie3_1,movie3_2,movie3_3,movie3_4]
const time1 = 22; //smaller interval
const time2 = 68;  //larger interval
var timeperword = 2000; // 2 secs
var timebetweenwords = 6000; // 6 secs
var wordspertrial = 10;
var fixation = '+';

const movie_wordlist = randomize_wordList(wordlist);
console.log(movie_wordlist)
function Movie({
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
    checker ={checker},
    participantId,
    setRedirectToEndPage
}) {
  const [currentVideo, setCurrentVideo] = useState(movies[currVidInd][currVidSubInd]);
  const [completedVideoCount, setCompletedVideoCount] = useState(0);
  const [isPlaying,setIsPlaying] = useState(true);
  const [word, setWord] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [plus, setPlus] = useState(false);
  const progress = Math.round((completedVideoCount / total_movies.length) * 100);
  const currentList = [];
  const [appearedWords, setAppearedWords] = useState([]);
  let currWordSubSubInd=0;
  useEffect(() => {
    setCurrentVideo(movies[currVidInd][currVidSubInd]);
    console.log("currently playing video: ",currVidInd,"_",currVidSubInd)
    setIsPlaying(true);
  }, [currVidInd, currVidSubInd, currWordInd, currWordSubInd]);

  useEffect(() => {
    const vid = document.getElementById("video-player");
    let last = 0;
    let lastShowPopupTime = 0;
    vid.addEventListener("timeupdate", (event) => {
      const tick = Math.floor(vid.currentTime);
      // console.log(tick)
      const interval = 6;
      const diff = tick - lastShowPopupTime
      if (tick != last && diff == 6 && tick <=105 ) {
        const currentWord = movie_wordlist[currWordInd][currWordSubInd][currWordSubSubInd];
        setWord(currentWord);
        currWordSubSubInd += 1;
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
      console.log("ended")
      console.log("videos completed till now: ", completedVideoCount + 1);
      setCompletedVideoCount(completedVideoCount + 1);
      setAppearedWords(currentList);
      setIsPlaying(false)
    });
  }, [currentVideo])
 

  return (
    <div style={{ position: "relative" }}>
      { !isPlaying && <Keyb vidIndArr = {vidIndArr} setvidIndArr={setvidIndArr} currVidInd={currVidInd} setCurrVidInd={setCurrVidInd} 
      currVidSubInd={currVidSubInd} setCurrVidSubInd={setCurrVidSubInd} setIsPlaying={setIsPlaying} 
      currWordInd={currWordInd} setCurrWordInd={setCurrWordInd} currWordSubInd={currWordSubInd} setCurrWordSubInd={setCurrWordSubInd} setRedirectToEndPage = {setRedirectToEndPage}
      allTrials={allTrials} setAllTrials={setAllTrials} sourceMemory={movie_wordlist[currWordInd][currVidSubInd]} appearedWords={make_stimuli(appearedWords, time1, time2)} checker ={checker}
      participantId={participantId}
      />}
     { isPlaying && 
     <div>
      <video
        src={currentVideo}
        id="video-player" 
        style={{ height: "100%", width: "100%" }}
        autoPlay
        muted
      />
        <div
          className="progress"
          style={{
            width: `${progress}%`,
            height: "15px",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "1000",
            textAlign: "center",
            lineHeight: "15px",
            background:
              progress <= 25
                ? "linear-gradient(to right, #FFA500, #FFA500)"
                : progress < 50
                ? "linear-gradient(to right, #FFA500, #FFD700)"
                : progress <= 75
                ? "linear-gradient(to right, #FFD700, #ADFF2F)"
                : "linear-gradient(to right, #ADFF2F, #ADFF2F)",
            borderRadius: "5px", // Gradient color
            color: "black", // Rounded edges
          }}
        >
          {progress}% Complete
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

export default Movie;
