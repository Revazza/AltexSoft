import { controls } from "../../../constants/controls";
import { useKeyPress } from "../../../hooks/useKeyPress";
import { useArena } from "./useArena";

const getDamage = (attacker, defender) => {
  // return damage

  return getHitPower(attacker) - getBlockPower(defender);
};

const getHitPower = (fighter) => {
  // return hit power
  console.log("Attacker: ", fighter);
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
};

const getBlockPower = (fighter) => {
  // return block power
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
};

export const useFight = () => {
  const { selectedPair } = useArena();

  const { playerOne, playerTwo } = selectedPair;

  const { keysPressed } = useKeyPress();

  const { playerOnePressedKeys, playerTwoPressedKeys } = keysPressed;

  const {
    playerOneAttack,
    playerOneBlock,
    playerTwoAttack,
    playerTwoBlock,
    playerOneCriticalHitCombination,
    playerTwoCriticalHitCombination,
  } = controls;

  // implement fight logic, return fighters details and winner details

  console.log(keysPressed)

  return {
    fighterOneDetails: playerOne,
    fighterTwoDetails: playerTwo,
  };

  return {
    // fighterOneDetails,
    // fighterTwoDetails,
    // winner,
  };
};
