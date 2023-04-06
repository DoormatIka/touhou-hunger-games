# touhou-hunger-games

This is a project I'm working on that takes inspiration from BrantSteele's Hunger Games Simulator and ZUN's Touhou Series.

This is meant to be the core codebase of the website this game will run in.

Planned features for a **Beta Release**:
  - The Entire Human Village, featuring 50 houses.
  - Players can move around in the world controlled by random chance via paths. (Graph data structures baby!)
  - Fighting other players, of course.
  - Events whenever someone dies.
  - 10 players is the limit.
  - Will be played via CLI.
    - The website will be hosted on an alpha release.

## Development Notes
### Locations
They're locations in the `src/new/core/data/locations` folder which is followed by more folders in it named `humanvillage`, etc.
They are there to be able to structure locations into a more readable state.

In those folders you find a lot of files named: `dragonstatue.ts`, `geidontei.ts`, etc. They are the areas the players moves in. They declare how many sub-areas, what the routes between those sub-areas are, and the "gates" that make them accessible to other areas.

Those files/areas are all combined into one graph data structure with this snippet:
```ts
createGraph(combineSubLocations(
  { name: "Human Village", objects: hv_objects, routes: hv_routes, gate: hv_gates },
  { name: "Dragon Statue", objects: ds_objects, routes: ds_routes, gate: ds_gates },
  { name: "Lily's Home",   objects: hh_objects, routes: hh_routes, gate: hh_gates },
))
```