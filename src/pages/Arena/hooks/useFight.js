import { useEffect, useState, useMemo } from "react";

import { controls } from "../../../constants/controls";
import { useKeyPress } from "../../../hooks/useKeyPress";
import { useArena } from "./useArena";

const getDamage = (attacker, defender) => {
  // return damage

  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);

  if (attacker.isStriking) return attacker.attack * 2;
  if (defender.blockIsOn || blockPower >= hitPower) return 0;

  return hitPower - blockPower;
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

const isStriking = (pressedKeysSlice, strikingKeys) => {
  const strPressedKeysSlice = pressedKeysSlice.join("");
  const strStrikingKeys = strikingKeys.join("");

  return strPressedKeysSlice === strStrikingKeys;
};

export const useFight = () => {
  const { selectedPair } = useArena();

  const { playerOne, playerTwo } = selectedPair;

  const [fighterOneDetails, setFighterOneDetails] = useState();
  const [fighterTwoDetails, setFighterTwoDetails] = useState();
  const [winner, setWinner] = useState();

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

  const [playerOneStrikeCombo, setPlayerOneStrikeCombo] = useState([]);
  const [playerTwoStrikeCombo, setPlayerTwoStrikeCombo] = useState([]);
  const [playerOneCanStrike, setPlayerOneCanStrike] = useState(true);
  const [playerTwoCanStrike, setPlayerTwoCanStrike] = useState(true);

  useEffect(() => {
    const playerOnePressedKey = keysPressed.playerOne;
    const playerTwoPressedKey = keysPressed.playerTwo;
    let damageDealt = 0;
    let attacker = "";

    
    if (playerOnePressedKey === playerOneAttack) {
      damageDealt = getDamage(fighterOneDetails, {
        ...fighterTwoDetails,
        blockIsOn: playerTwoPressedKey === playerTwoBlock,
      });
      attacker = "p1";
    } else if (playerTwoPressedKey === playerTwoAttack) {
      damageDealt = getDamage(fighterTwoDetails, {
        ...fighterOneDetails,
        blockIsOn: playerOnePressedKey === playerOneBlock,
      });
      attacker = "p2";
    } else if (playerOneCriticalHitCombination.includes(playerOnePressedKey)) {
      let tempComboArr = [...playerOneStrikeCombo];
      tempComboArr.push(playerOnePressedKey);

      if (playerOneCanStrike && tempComboArr.length >= 3) {
        //getting 3 last pressed keys
        const comboArr = tempComboArr.slice(
          tempComboArr.length - 3,
          tempComboArr.length
        );

        if (isStriking(comboArr, playerOneCriticalHitCombination)) {
          attacker = "p1";
          damageDealt = getDamage(
            { ...fighterOneDetails, isStriking: true },
            fighterTwoDetails
          );

          setPlayerOneCanStrike(false);
          setTimeout(() => {
            setPlayerOneCanStrike(true);
          }, 10000);
          setPlayerOneStrikeCombo([]);
        } else {
          //keeping just 3 combos instead of many combos at the time
          setPlayerOneStrikeCombo(comboArr);
        }
      } else {
        setPlayerOneStrikeCombo(tempComboArr);
      }
    } else if (playerTwoCriticalHitCombination.includes(playerTwoPressedKey)) {
      let tempComboArr = [...playerTwoStrikeCombo];
      tempComboArr.push(playerTwoPressedKey);
      if (playerTwoCanStrike && tempComboArr.length >= 3) {
        //getting 3 pressed keys
        const comboArr = tempComboArr.splice(
          tempComboArr.length - 3,
          tempComboArr.length
        );

        if (isStriking(comboArr, playerTwoCriticalHitCombination)) {
          attacker = "p2";

          damageDealt = getDamage(
            { ...fighterTwoDetails, isStriking: true },
            fighterOneDetails
          );

          setPlayerTwoCanStrike(false);
          setTimeout(() => {
            setPlayerTwoCanStrike(true);
          }, 10000);
          setPlayerTwoStrikeCombo([]);
        } else {
          //keeping just 3 combos instead of many combos at the time
          setPlayerTwoStrikeCombo(comboArr);
        }
      } else {
        setPlayerTwoStrikeCombo(tempComboArr);
      }
    }

    let difference = 0;

    if (attacker === "p1") {
      let tempFighterDetails = { ...fighterTwoDetails };
      difference = tempFighterDetails.health-damageDealt;
      if(difference <= 0)
        setWinner(playerOne);
      else{
        tempFighterDetails.health = difference;
        setFighterTwoDetails(tempFighterDetails);
      }
    }
    if (attacker === "p2") {
      let tempFighterDetails = { ...fighterOneDetails };
      difference = tempFighterDetails.health - damageDealt;
      if(difference <= 0)
        setWinner(playerTwo);
      else{
        tempFighterDetails.health = tempFighterDetails.health - damageDealt;
        setFighterOneDetails(tempFighterDetails);
      }
    }
  }, [keysPressed.playerOne, keysPressed.playerTwo]);

  return {
    fighterOneDetails: fighterOneDetails,
    fighterTwoDetails: fighterTwoDetails,
    winner:winner,
  };
};
