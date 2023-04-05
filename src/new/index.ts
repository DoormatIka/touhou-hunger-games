import chalk from "chalk";
import { generateRandomNumber, Player } from "./core/player.js";
import {
  Area,
  createGraph,
  getPlayersLength,
  shallowTraverseGraph
} from "./core/area.js";
import { markPlayers, sweepPlayer } from "./core/actions/mark.js";
import {batchMoveTo} from "./core/actions/move.js";

const hv_objects = [
  "Road",
  "House 1",
  "House 2",
  "House 3"
];
const hv_routes = [
  ["House 1", "Road"], ["House 1", "House 2"],
  ["House 2", "Road"],
  ["House 3", "Road"]
];

for (let i = 5; i < 1000; i++) {
  hv_objects.push(`House ${i}`);
  hv_routes.push([`House ${i}`, "Road"])
}
  const adj_list = createGraph(hv_objects, hv_routes)
  const road = adj_list.get("Road")!
  const playerLen = 5000;
  for (let i = 0; i < playerLen; i++) {
    const player = new Player(`p${i}`);
    player.currentArea = "Road";
    road.players.push(player);
  }

  const prev = performance.now()
  main(adj_list)
  const curr = performance.now()

console.log(`${chalk.bgGreen("Iterations")}: 30`)
  console.log(`${chalk.bgGreen(chalk.black(`Performance`))}: ${curr-prev}ms taken.`)


function main(adj_list: Map<string, Area>) {
  let rounds = 300;
  console.log(chalk.green(`${getPlayersLength(adj_list)} players left.`))
  // while (getPlayersLength(adj_list) > 1)
  for (let i = 0; i < rounds; i++) {
    // console.log(chalk.bgGray(chalk.bold(`Move ${rounds}`)))
    // console.dir(adj_list, {depth: null})

    shallowTraverseGraph(adj_list, (area, current) => {
      // console.log(`Checking location "${current}" for players.`)
      arrayMoveTo(area, adj_list);
    })

    
    shallowTraverseGraph(adj_list, (area, curr) => {
      markPlayers(area, (unmarked, marked) => {
        // console.log(`${unmarked.id} fought with ${unmarked.foughtWith} with a power of ${unmarked.getFightingChance()} and ${marked.getFightingChance()} respectively`)
        // console.log(`${unmarked.isAlive ? marked.id : unmarked.id} died with the fight. \n`)
      })
  
      for (let i = 0; i < area.players.length; i++) {
        area.players[i].hasMoved = false;
        sweepPlayer(area, i);
      }
    })
    // console.log(chalk.green(`${getPlayersLength(adj_list)} players left.`))
    // rounds++;
  }

  console.log(chalk.green(`${getPlayersLength(adj_list)} players left.`))

}

function arrayMoveTo(area: Area, adj_list: Map<string, Area>) {
  for (let i = area.players.length - 1; i >= 0; i--) {
    const player = area.players[i];
      const ran = generateRandomNumber(area.to.length);
      const chosen_area = adj_list.get(area.to[ran])!;

      player.currentArea = area.to[ran];

      player.hasMoved = true;
      chosen_area.players.push(area.players.splice(i, 1)[0])
  }
}