import { useState, useEffect } from "react";



export const useKeyPress = () => {
  // implement key press logic
  // return pressed key codes

  const [keyboardTouched, setKeyboardTouched] = useState(false);
    
  const [playerOnePressedKeys,setPlayerOnePressedKeys] = useState([]);
  const [playerTwoPressedKeys,setPlayerTwoPressedKeys] = useState([]);
  const [attacker,setAttacker] = useState('');

  const keyUpHandler = (event) => {
    setKeyboardTouched(true);
    //setting time out and clearing previous arrayes
    //because you've mentioned 'you need to simultaneously press the 3 corresponding keys'

    if (
      event.code === "KeyA" ||
      event.code === "KeyD" ||
      event.code === "KeyQ" ||
      event.code === "KeyW" ||
      event.code === "KeyE"
    ) {
      setAttacker('p1');
      setPlayerOnePressedKeys( (prevState)=>{
        return [...prevState,event.code];
      })
    }
    if (
      event.code === "KeyJ" ||
      event.code === "KeyL" ||
      event.code === "KeyU" ||
      event.code === "KeyI" ||
      event.code === "KeyO"
    ) {
      setAttacker("p2");
      setPlayerTwoPressedKeys( (prevState) =>{
        return [...prevState,event.code];
      })
    }
  };

  useEffect(() => {
    setKeyboardTouched(false);
    //clearing user's pressed keys only after user won't touch the keyboard
    //in order to avoid working with big arrayes and to keep it simple
    const resetTimer = setTimeout(() => {
      setPlayerOnePressedKeys([]);
      setPlayerTwoPressedKeys([]);
    }, 5000);

    return () => {
      clearTimeout(resetTimer);
    };
  }, [keyboardTouched]);

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  const keysPressed = {
    attacker:attacker,
    playerOnePressedKeys: playerOnePressedKeys,
    playerTwoPressedKeys: playerTwoPressedKeys,
  };

  return {
    // keysPressed
    keysPressed,
  };
};
