import { Player, compareFightingChance } from "./player";
import { 
  createGraph, 
  moveTo, 
  returnRelatedPathsofPlayer, 
  shallowMarkPlayers,
  getPlayersLength,
  getAreaLength,
} from "./area";

const hv_objects = [
  "Road", 
  "House 1", 
  "House 2",
  "House 3",
  "House 4",
  "House 5",
  "House 6"
];
const hv_routes = [
  ["House 1", "Road"],
  ["House 2", "Road"],
  ["House 3", "Road"],
  ["House 4", "Road"],
  ["House 5", "Road"],
  ["House 6", "Road"],
];

for (let i = 6; i < 1000; i++) {
  hv_objects.push(`House ${i}`);
  hv_routes.push([`House ${i}`, "Road"]);
}

const adj_list = createGraph(hv_objects, hv_routes)
const players = [];

for (let i = 0; i < 5000; i++) {
  const pal = new Player(`p${i}`);
  pal.currentArea = "Road"
  players.push(pal);
}
adj_list.get("Road")?.players.push(...players)

// console.log(adj_list)


const shallowtime = []
const len = 15;

for (let i = 0; i < len; i++) {
  const move_prevt = performance.now()
  for (let i = 0; i < players.length; i++) { // MOVING PHASE
    const paths = returnRelatedPathsofPlayer("Road", `p${i}`, adj_list);
    if (paths && paths.related) {
      const random_choice = Math.floor(Math.random() * paths.related.length);
      const moved = moveTo(paths.now, paths.related[random_choice], `p${i}`, adj_list);
      if (moved) {
        // console.log(`Moved ${moved.playerId} to ${moved.new_path} from ${moved.start}`)
      }
    }
  }
  const move_currt = performance.now()
  console.log(`Move: ${move_currt - move_prevt}ms`)

  const shallow_prevt = performance.now()
  for (let j = 0; j <= 15; j++) {
    if (j > 3) {
      shallowMarkPlayers(adj_list);
    }
  }
  const shallow_currt = performance.now()
  console.log(`Shallow: ${shallow_currt - shallow_prevt}ms`)
  shallowtime.push(shallow_currt - shallow_prevt)

  console.log(`Player count: ${getPlayersLength(adj_list)}`);
  console.log(`Area length: ${getAreaLength(adj_list)} \n`)
}
console.log(`Average Shallow: ${shallowtime.reduce((prev, curr) => { return curr + prev }) / shallowtime.length}ms`)