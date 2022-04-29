import { useEffect, useState } from "react";

import { controls } from "../../../constants/controls";
import { useKeyPress } from "../../../hooks/useKeyPress";
import { useArena } from "./useArena";

const getDamage = (attacker, defender) => {
  // return damage

  if (attacker.usedStrike) return 0;

  return getHitPower(attacker) - getBlockPower(defender);
};

const getHitPower = (fighter) => {
  // return hit power
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
};

const getBlockPower = (fighter) => {
  // return block power
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
};

const isStrikingCalculator = (pressedKeysSlice, strikingKeys) => {
  const strPressedKeysSlice = pressedKeysSlice.join("");
  const strStrikingKeys = strikingKeys.join("");

  return strPressedKeysSlice === strStrikingKeys;
};

const isStriking = (pressedKeys, strikingKeys) => {
  for (let i = 0; i < pressedKeys.length - 1; i++) {
    if (isStrikingCalculator(pressedKeys.slice(i, i + 3), strikingKeys)) {
      console.log("Player 1 Striking");
      return true;
    }
  }

  return false;
};

export const useFight = () => {
  const { selectedPair } = useArena();

  const { playerOne, playerTwo } = selectedPair;

  const [fighterOneDetails, setFighterOneDetails] = useState();
  const [fighterTwoDetails, setFighterTwoDetails] = useState();

  useEffect(() => {
    const p1 = {
      ...playerOne,
      initialHealth: playerOne.health,
    };
    const p2 = {
      ...playerTwo,
      initialHealth: playerTwo.health,
    };
    setFighterOneDetails(p1);
    setFighterTwoDetails(p2);
  }, [playerOne, playerTwo]);

  const { keysPressed } = useKeyPress();

  const {
    playerOneAttack,
    playerOneBlock,
    playerTwoAttack,
    playerTwoBlock,
    playerOneCriticalHitCombination,
    playerTwoCriticalHitCombination,
  } = controls;

  // implement fight logic, return fighters details and winner details

  const playerOnePressedKeys = keysPressed.playerOnePressedKeys;
  const playerTwoPressedKeys = keysPressed.playerTwoPressedKeys;

  useEffect(() => {

    let damageDealt;
    let isDamageStrike;
    if (keysPressed.attacker === "p1") {
      isDamageStrike = isStriking(
        playerOnePressedKeys,
        playerOneCriticalHitCombination
      );

      if (isDamageStrike)
        damageDealt = getDamage(
          { ...fighterOneDetails, usedStrike: true },
          fighterTwoDetails
        );
      else
        damageDealt = getDamage(
          { ...fighterOneDetails, usedStrike: false },
          fighterTwoDetails
        );

      setFighterTwoDetails((prevState) => {
        return {
          ...prevState,
          health: prevState.health - damageDealt,
        };
      });
    } else if(keysPressed.attacker === 'p2') {
      isDamageStrike = isStriking({
        playerTwoPressedKeys,
        playerTwoCriticalHitCombination,
      });

      if (isDamageStrike) {
        damageDealt = getDamage(
          { ...fighterTwoDetails, usedStrike: true },
          fighterOneDetails
        );
      }
      else{
        damageDealt = getDamage(
          { ...fighterTwoDetails, usedStrike: false },
          fighterOneDetails
        );
      }

       setFighterOneDetails((prevState) => {
         return {
           ...prevState,
           health: prevState.health - damageDealt,
         };
       });

    }
  }, [playerOnePressedKeys, playerTwoPressedKeys]);

  return {
    fighterOneDetails: fighterOneDetails,
    fighterTwoDetails: fighterTwoDetails,
  };

  return {
    // fighterOneDetails,
    // fighterTwoDetails,
    // winner,
  };
};
