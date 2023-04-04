import { Player } from "../core/player.js";
import { 
  createGraph, 
  deepMoveTo, 
  returnRelatedPathsofPlayer, 
  markPlayers,
  getPlayersLength,
  getAreaLength,
} from "../core/area.js";

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


for (let i = 1; i < 4; i++) {
  const players = [];
  for (let i = 0; i < 5000; i++) {
    const pal = new Player(`p${i}`);
    pal.currentArea = "Road"
    players.push(pal);
  }
  adj_list.get("Road")?.players.push(...players)


  const len = 15 * i;

  const prev = performance.now()
  for (let i = 0; i < len; i++) {
    const playerLen = getPlayersLength(adj_list)
    // console.log(`Player count: ${}`);
    // console.log(`Area length: ${getAreaLength(adj_list)}`);

    for (let i = 0; i < players.length; i++) { // MOVING PHASE
      const paths = returnRelatedPathsofPlayer("Road", `p${i}`, adj_list);
      if (paths && paths.related) {
        const random_choice = Math.floor(Math.random() * paths.related.length);
        const moved = deepMoveTo(paths.now, paths.related[random_choice], `p${i}`, adj_list);
        if (moved) {
          // console.log(`Moved ${moved.playerId} to ${moved.new_path} from ${moved.start}`)
        }
      }
    }

    for (let j = 0; j <= 15; j++) {
      if (j > 3) {
        markPlayers("Road", adj_list);
      }
    }
  }
  const next = performance.now()
  console.log(`Deep: Ran for ${next - prev}ms on ${len} iterations.`)
}