import { Player } from "./player";
import { 
  createGraph, 
  moveTo, 
  shallowReturnRelatedPathsofPlayer,
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
];
const hv_routes = [
  ["House 1", "Road"], ["House 1", "House 2"],
  ["House 2", "Road"], ["House 2", "House 3"],
  ["House 3", "Road"],
  ["House 4", "Road"],
];


const adj_list = createGraph(hv_objects, hv_routes)
const players = [];

for (let i = 0; i < 15; i++) {
  const player = new Player(`p${i}`);
  player.currentArea = "Road"
  players.push(player);
}
adj_list.get("Road")?.players.push(...players)



let j = 0;

console.log(`Area length: ${getAreaLength(adj_list)}`);
while (getPlayersLength(adj_list) > 1) {
  for (let i = 0; i < players.length; i++) { // MOVING PHASE
    const paths = shallowReturnRelatedPathsofPlayer(adj_list, `p${i}`);
    if (paths && paths.related) {
      const random_choice = Math.floor(Math.random() * paths.related.length);
      const moved = moveTo(paths.now, paths.related[random_choice], `p${i}`, adj_list);
      if (moved) {
        console.log(`Moved p${i} to ${moved} from ${paths.now}`);
      }
    }
  }

  shallowMarkPlayers(adj_list, (killed, alive) => {
    console.log(`${killed.id} has been killed by ${alive.id}`);
  });
  j++;
}