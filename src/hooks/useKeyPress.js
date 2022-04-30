import { useState, useEffect } from "react";

export const useKeyPress = () => {
  // implement key press logic
  // return pressed key codes

  const [playerOnePressedKey, setPlayerOnePressedKey] = useState("");
  const [playerTwoPressedKey, setPlayerTwoPressedKey] = useState("");


  const keyUpHandler = (event) => {
    const pressedKey = event.code;

    if (
      pressedKey === "KeyA" ||
      pressedKey === "KeyD" ||
      pressedKey === "KeyQ" ||
      pressedKey === "KeyW" ||
      pressedKey === "KeyE"
    ) {
      setPlayerOnePressedKey("");
    }

    if (
      pressedKey === "KeyJ" ||
      pressedKey === "KeyL" ||
      pressedKey === "KeyU" ||
      pressedKey === "KeyI" ||
      pressedKey === "KeyO"
    )
    {
      setPlayerTwoPressedKey("");
    }
      
  };

  const keyDownHandler = (event) => {
    const pressedKey = event.code;

    if (
      pressedKey === "KeyA" ||
      pressedKey === "KeyD" ||
      pressedKey === "KeyQ" ||
      pressedKey === "KeyW" ||
      pressedKey === "KeyE"
    ) {
      setPlayerOnePressedKey(pressedKey);
    }

    if (
      pressedKey === "KeyJ" ||
      pressedKey === "KeyL" ||
      pressedKey === "KeyU" ||
      pressedKey === "KeyI" ||
      pressedKey === "KeyO"
    ) {
      setPlayerTwoPressedKey(pressedKey);
    }
  };

  

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return {
    // keysPressed
    keysPressed: {
      playerOne: playerOnePressedKey,
      playerTwo: playerTwoPressedKey,
    },
  };
};
