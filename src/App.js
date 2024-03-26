import './App.css';
import { useEffect, useState, useCallback } from "react";
import "react-step-progress-bar/styles.css";
import Movie from './pages/Movie';
import IntroPage from './pages/intro';
import TrailMovie from './pages/TrailMovie';
import EndPage from './pages/end_page';
function App() {

  const [vidIndArr, setVidIndArr]=useState([0,1,2]);
  let ind=parseInt(Math.random() * 100) % vidIndArr.length;
  const [checker,setChecker] = useState(true)
  const [currVidInd, setCurrVidInd]=useState(ind);
  const [currVidSubInd, setCurrVidSubInd]=useState(0)
  const [currWordInd, setCurrWordInd]=useState(0);
  const [currWordSubInd, setCurrWordSubInd]=useState(0);
  const [isIntro,setIsIntro] =useState(true)
  const [isTrail,setIsTrail] =useState(true)
  const [allTrials, setAllTrials] = useState([]);
  const [participantId, setParticipantId] = useState("");
  const [redirectToEndPage, setRedirectToEndPage] = useState(false);
  useEffect(() => {
    const newArray = [...vidIndArr];
    newArray.splice(ind, 1); // remove one element at index ind
    setVidIndArr(newArray);
  }, []);
  console.log("will the source memory question be asked? : ",checker);
  console.log("Video index array is :", vidIndArr);
  console.log("isIntro:", isIntro, "and isTrail:", isTrail)
  return (
    <div>
    {isIntro ? (
      <IntroPage vidIndArr = {vidIndArr} currVidInd={currVidInd} currVidSubInd={currVidSubInd} currWordInd={currWordInd} currWordSubInd={currWordSubInd}
                  setCurrVidInd={setCurrVidInd} setCurrVidSubInd={setCurrVidSubInd} setCurrWordInd={setCurrWordInd} setCurrWordSubInd={setCurrWordSubInd} 
                  checker ={checker} setIsIntro={setIsIntro} allTrials={allTrials} setAllTrials={setAllTrials} participantId={participantId} setParticipantId = {setParticipantId}/>
    ): isTrail ?(
    <TrailMovie vidIndArr = {vidIndArr} currVidInd={currVidInd} currVidSubInd={currVidSubInd} currWordInd={currWordInd} currWordSubInd={currWordSubInd}
                setCurrVidInd={setCurrVidInd} setCurrVidSubInd={setCurrVidSubInd} setCurrWordInd={setCurrWordInd} setCurrWordSubInd={setCurrWordSubInd} 
                checker={checker} setIsIntro={setIsIntro} allTrials={allTrials} setAllTrials={setAllTrials} setIsTrail={setIsTrail}  participantId={participantId} />
    ) : redirectToEndPage ? (
      <EndPage/>
    ):(
      <Movie vidIndArr = {vidIndArr} currVidInd={currVidInd} currVidSubInd={currVidSubInd} currWordInd={currWordInd} currWordSubInd={currWordSubInd}
             setCurrVidInd={setCurrVidInd} setCurrVidSubInd={setCurrVidSubInd} setCurrWordInd={setCurrWordInd} setCurrWordSubInd={setCurrWordSubInd} 
             checker={checker} setIsIntro={setIsIntro} allTrials={allTrials} setAllTrials={setAllTrials} participantId={participantId} setRedirectToEndPage = {setRedirectToEndPage}/>
    )}
    </div>
  );
}

export default App;
