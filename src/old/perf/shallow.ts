import chalk from "chalk";
import { Player } from "../core/player.js";
import { 
  createGraph, 
  getPlayersLength,
  getAreaLength,
} from "../core/area.js";
import { shallowSweepPlayers } from "../core/actions/mark.js";
import { moveRandom } from "../core/actions/move.js";
import { shallowMarkPlayers } from "../core/actions/mark.js";

const hv_objects = [
  "Road", 
  "House 1", 
  "House 2",
  "House 3",
  "House 4",
];
const hv_routes = [
  ["House 1", "Road"], ["House 1", "House 2"],
  ["House 2", "Road"], ["House 2", "House 3"],
  ["House 3", "Road"],
  ["House 4", "Road"],
];

for (let i = 5; i < 1000; i++) {
  hv_objects.push(`House ${i}`);
  hv_routes.push([`House ${i}`, "Road"])
}

for (let i = 1; i < 4; i++) {
  const adj_list = createGraph(hv_objects, hv_routes)
  const road = adj_list.get("Road")!
  const players = [];
  for (let i = 0; i < 5000; i++) {
    const player = new Player(`p${i}`);
    player.currentArea = "Road";
    players.push(player);
    road.players.push(player);
  }


  let j = 0;

  console.log(`Area length: ${getAreaLength(adj_list)} | Player length: ${getPlayersLength(adj_list)}`);
  const len = 15 * i;

  const prev = performance.now()
  for (let i = 0; i < len; i++) {
    for (let i = 0; i < players.length; i++) { // MOVING PHASE
      const moved = moveRandom(`p${i}`, adj_list)
      if (moved) {
        // console.log(`Moved ${moved.playerId} to ${moved.new_path} from ${moved.start}`)
      }
    }
    shallowMarkPlayers(adj_list, (killed, alive) => {
      // console.log(`${chalk.bgRedBright("KILL:")} ${killed.id} has been killed by ${alive.id}.`);
    });
    shallowSweepPlayers(adj_list);

    j++;
  }
  const next = performance.now()
  console.log(chalk.gray(`Shallow (New implementation): ${next - prev}ms ran on ${len} iterations.`))
}