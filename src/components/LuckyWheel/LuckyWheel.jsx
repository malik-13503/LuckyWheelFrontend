// import React from 'react'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wheel } from "react-custom-roulette";
import PrizeWindow from "../PrizeWindow/PrizeWindow";
import "./LuckyWheel.css";

function LuckyWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wheelData, setWheelData] = useState(generateWheelData());
  const [prizes, setPrizes] = useState([]);

  useEffect(() => {
    const fetchPrizesAndUpdateWheelData = async () => {
      try {
        const response = await fetch('./prizes.json');
        const data = await response.json();

        setPrizes(data);

        // Si generateWheelData es async, usamos await aquí
        const updatedWheelData = await generateWheelData(data);

        setWheelData(updatedWheelData);
      } catch (error) {
        console.error("Error when obtaining Prizes:", error);
      }
    };

    fetchPrizesAndUpdateWheelData();
  }, []);


  async function generateWheelData(prizes) {
    const visibleData = [];
    const prizesInStock = [];
    
    // Filtrar premios que tienen stock
    prizes.forEach((prize) => {
        if (prize.stock > 0) {
            prizesInStock.push(prize);
        }
    });

    console.log("stock", prizesInStock);

    // Determine the maximum number of views per award
    const totalVisualizations = Math.min(prizesInStock.length * 3, 18); // Increase total views

    // Alternative colors for awards
    const colors = ["#FDA800", "black", "white"];
    
    for (let i = 0; i < totalVisualizations; i++) {
        const prize = prizesInStock[i % prizesInStock.length]; // Switch between prizes
        const colorIndex = i % colors.length; // Toggle between colors
        

        // Set the style using alternating color
        let style = {
            backgroundColor: colors[colorIndex],
            textColor: colors[colorIndex] === "white" ? "black" : "white", // Change text color if background is white
            fontSize: prize.option === "Try again" ? "16" : "15",
        };

        // Agregar el premio al array intercalado
        visibleData.push({
            option: prize.option,
            img: prize.img,
            gender: prize.gender,
            style: style,
        });
    }

    return visibleData.length > 0 ? visibleData : [];
}


  async function handlePrizeWon(prizeName, setWheelData) {
    // Encontrar el premio en la lista actual
    const prize = prizes.find((p) => p.option === prizeName);

    // Verificar si tiene stock
    if (prize && prize.stock > 0) {
      try {
        // Hacer una llamada al backend para actualizar el stock
        const response = await fetch("https://luckywheelbackend.onrender.com/prizes/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ option: prizeName }), // Enviar el nombre del premio
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Actualizar los premios locales con los datos del backend
          setPrizes(data.prizes);

          // Generar los nuevos datos de la ruleta con los premios actualizados
          setTimeout(() => {
            const updatedWheelData = generateWheelData();
            setWheelData(updatedWheelData);
          }, 100000);
        } else {
          console.error("Error updating stock:", data.message);
        }
      } catch (error) {
        console.error("Backend call failed:", error);
      }
    }
  }

  const handleSpinClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.spinCount >= 10) {
      alert("You've already Spin, you can't continue");
    } else {
      const newSpinCount = user.spinCount + 1;
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          spinCount: newSpinCount,
        })
      );
      setShowResult(false);
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);

      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStop = () => {
    setSpinCount(spinCount + 1);
    const wonPrize = wheelData[prizeNumber].option;
    // Primero actualiza el stock
    handlePrizeWon(wonPrize, setWheelData).then(() => {
      // Después de actualizar el stock, muestra el resultado
      setMustSpin(false);
      setShowResult(true);
    });
  };

  const handleBackToStart = (e) => {
    e.preventDefault();
    window.location.href = "/";
    localStorage.removeItem("user");
  };

  return (
    <>
      {wheelData.length > 0 ? (
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStop}
          data={wheelData}
          backgroundColors={["#BC0D0D", "#BC0D0D"]}
          textColors={["#ffffff"]}
          spinDuration={0.6}
          outerBorderWidth={1}
          outerBorderColor="white"
          innerRadius={0}
          radiusLineWidth={0}
          // fontSize={20}
          textDistance={58}
        />
      ) : (
        <p>Loading prizes...</p>
      )}
      <button className="spin-button" onClick={handleSpinClick}>
        Spin and Win!
      </button>
      <button className="spin-button" onClick={handleBackToStart}>
        Back to Form
      </button>

      {wheelData.length > 0 && (
        <PrizeWindow
          data={wheelData[prizeNumber]}
          showResult={showResult}
          setShowResult={setShowResult}
        />
      )}
      
    </>
  );
}

export default LuckyWheel;