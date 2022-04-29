import { useState, useEffect, useReducer } from "react";


const initialState = {
  playerOne: {
    keysPressed: [],
    canStrike: true,
    isStriking: false,
  },
  playerTwo: {
    keysPressed: [],
    canStrike: true,
    isStriking: false,
  },
};

const isStrikingCalculator = (pressedKeysSlice, strikingKeys) => {
  const strPressedKeysSlice = pressedKeysSlice.join("");
  const strStrikingKeys = strikingKeys.join("");

  return strPressedKeysSlice === strStrikingKeys;
};

const isStriking = (pressedKeys, type) => {
  let strikingKeys;
  
  if (type === "P1") {
    strikingKeys = ["KeyQ", "KeyW", "KeyE"];
    
    for (let i = 0; i < pressedKeys.length - 1; i++) {
      if(isStrikingCalculator(pressedKeys.slice(i,i+3),strikingKeys))
      {
        console.log("Player 1 Striking");
        return true;
      }
    }
  }
  else{
    strikingKeys = ["KeyU", "KeyI", "KeyO"];

    for (let i = 0; i < pressedKeys.length - 1; i++) {
      if (isStrikingCalculator(pressedKeys.slice(i, i + 3), strikingKeys))
      {
        console.log("Player 2 Striking");
        return true;
      }
    }
  }
  
  return false;
};

const playersActionReducer = (state, action) => {
  let keysPressed;
  let player;

  if (action.type === "P1") {
    player = { ...state.playerOne };
    keysPressed = player.keysPressed;
    console.log("Before: ", keysPressed);

    keysPressed.push(action.keyPressed);
    
    console.log("After: ", keysPressed);

    if(isStriking(keysPressed,action.type) && player.canStrike)
    {
      player.canStrike = false;
      player.isStriking = true;

      setTimeout(() => {
        // TODO: add function to isStriking to remove after strike
      }, 1000);

      return {
        ...state,
        playerOne:player,
      };

    }
  }
  if (action.type === "P2") {
    player = { ...state.playerTwo };
    keysPressed = player.keysPressed;
    keysPressed.push(action.keyPressed);
    if (isStriking(keysPressed, action.type) && player.canStrike) {
      player.canStrike = false;
      player.isStriking = true;

      setTimeout(() => {
        // TODO: add function to isStriking to remove after strike
      }, 1000);

      return {
        ...state,
        playerTwo: player,
      };
    }
  }

  return state;
};

export const useKeyPress = () => {
  // implement key press logic
  // return pressed key codes

  
  const [playerAction, dispatch] = useReducer(playersActionReducer,initialState);

  const keyDownHandler = (event) => {
    //setting time out and clearing previous arrayes
    //because you've mentioned 'you need to simultaneously press the 3 corresponding keys'

    if (
      event.code === "KeyA" ||
      event.code === "KeyD" ||
      event.code === "KeyQ" ||
      event.code === "KeyW" ||
      event.code === "KeyE"
    ) {
      dispatch({type:'P1',keyPressed:event.code});
    }
    if (
      event.code === "KeyJ" ||
      event.code === "KeyL" ||
      event.code === "KeyU" ||
      event.code === "KeyI" ||
      event.code === "KeyO"
    ) {
      dispatch({ type: "P2", keyPressed: event.code });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const keysPressed = {
    playerOne: playerAction.playerOne,
    playerTwo: playerAction.playerTwo,
  };

  return {
    // keysPressed
    keysPressed,
  };
};
