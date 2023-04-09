import kill from "./kill.json" assert { type: "json" };
import stay from "./stay.json" assert { type: "json" };
import death from "./death.json" assert { type: "json" };
import move from "./move.json" assert { type: "json" };
import { generateRandomNumber } from "../../player.js";

export function chooseKill(
  playerKilled: string, 
  playerKiller: string,
  killedDamage: number,
  killerDamage: number
) {
  const ran = generateRandomNumber(kill.length);
  const chosen_message = kill[ran];

  return chosen_message
    .replaceAll("$killedDamage", `${killedDamage} damage`)
    .replaceAll("$killerDamage", `${killerDamage} damage`)
    .replaceAll("$killed", playerKilled)
    .replaceAll("$killer", playerKiller)
}

export function chooseDeath(playerId: string) {
  const ran = generateRandomNumber(death.length);
  const chosen_message = death[ran];

  return chosen_message
    .replaceAll("$player", playerId);
}

export function chooseStay(playerId: string, location: string) {
  const ran = generateRandomNumber(stay.length);
  const chosen_message = stay[ran];

  return chosen_message
    .replaceAll("$player", playerId)
    .replaceAll("$location", location)
}

export function chooseMove(playerId: string, tolocation: string, fromlocation: string) {
  const ran = generateRandomNumber(move.length);
  const chosen_message = move[ran];

  return chosen_message
    .replaceAll("$player", playerId)
    .replaceAll("$tolocation", tolocation)
    .replaceAll("$fromlocation", fromlocation)
}