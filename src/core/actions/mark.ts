import { shallowTraverseGraph, Area } from "../area.js";
import { Player } from "../player.js";

/**
 * Marks players to be sweeped by the moveTo command. Handles player to player interaction.
 * 
 * Does a shallow traversal of the graph.
 * @param adj_list The adjacent list.
 * @param onKill Function to be passed in when someone is killed.
 */
export function shallowMarkPlayers(adj_list: Map<string, Area>, onKill?: (killed_player: Player, alive_player: Player) => void) {
  shallowTraverseGraph(adj_list, (area) => {
    if (area.players.length == 0) return;

    area.players.reduce((prev, curr) => {
      if (!prev.isAlive || !curr.isAlive) return curr;

      prev.generateFightingChance()
      curr.generateFightingChance()

      if (prev.getFightingChance() < curr.getFightingChance()) {
        curr.kill()
        if (onKill)
          onKill(curr, prev);
      }
      return curr;
    })
  })
}

export function shallowSweepPlayers(adj_list: Map<string, Area>) {
  shallowTraverseGraph(adj_list, (area, current) => {
    area.players.forEach((player, i) => {
        if (!player.isAlive) {
          area.players.splice(i, 1);
        }
    })
  })
}