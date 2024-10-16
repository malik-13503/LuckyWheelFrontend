export default function PrizeWindow({ data, showResult, setShowResult }) {

    const handleSpinAgain = (event) =>{
        event.preventDefault()
        setShowResult(false)
    }

    const handleBackToStart = (e) => {
        e.preventDefault();
        window.location.href = "/";
        localStorage.removeItem("user");
    }

  return showResult ? (
    <div className="overlay">
            <div className="prize-window-container">
                {data.option === "Try again" ? (
                    <>
                    <h2>Better Luck For Next Time!</h2>
                    <h3>Thanks For Playing.</h3>
                    <button className="spin-again-button" type="button" onClick={handleSpinAgain}>Back to Form</button>
                    
                    </>
                    
                ) : data.gender === "fem" ? (
                    <>
                    <h2>Congratulations!</h2>
                    <h2>You won a {data.option}</h2>
                    {/*<img src="/css/yerbera.jpg" alt="yerbera"/> */}
                    <h3>Don't forget to claim your prize before returning to the start</h3>
                    <button className="spin-again-button" type="button" onClick={handleBackToStart}> Back to Form</button>
                    </>
                ) : data.gender === "masc" ? (
                    <>
                    <h2>Congratulations!</h2>
                    <h2>You won a {data.option}</h2>
                   {/* <img src="/css/set-matero-6.webp" alt="set matero"></img> */}
                    <h3>Don't forget to claim your prize before returning to the start</h3>
                    <button className="spin-again-button" type="button" onClick={handleBackToStart}> Back to Form</button>                   
                    </>
                    
                ): (null)}
            </div>
        </div>
  ) : null;
}