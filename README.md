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


---

## Development Notes
### Locations
They're locations in the `src/new/core/data/locations` folder which is followed by more folders in it named `humanvillage`, etc.
They are there to be able to structure locations into a more readable state.

In those folders you find a lot of files named: `dragonstatue.ts`, `geidontei.ts`, etc. They are the areas the players moves in. They declare how many sub-areas, what the routes between those sub-areas are, and the "gates" that make them accessible to other areas.

Those files/areas are all combined into one scaffold with this command:

`bun "location compile"` or `npm run "location compile"`

The scaffold is a .json file that is used to make the graph data structure in `core/index.ts`


### Performance
There are three processes that are in this project: moving players, marking players, and deleting marked players.

Measured in *seconds*. Ran with bun.

The benchmark measures how fast moving 25 players through 9001 areas randomly is.

The source code for these are in src/perf/speed.ts. It's averaged through "Iterations x"
| Methods                | Iterations 15  | Iterations 30 | Iterations 300 | Iteration 1 |
|------------------------|----------------|---------------|----------------|-------------|
| DFS Tree Traversal     | 346            | 1066.15       | 5710           | 29.10       |
| Shallow (new moveTo)   | 87 (3.97x)     | 281.65 (3.78x)| 783.88 (7.3x)  | 7.23 (4.02x)|


#### DFS Tree Traversal iterates through the graph every time a process is called.
When moving players gets called, it loops through the graph from the top. That loop repeats for every process called.
This isn't very costly on small areas but I'm trying to make a massive world here, so this will not cut it.

**DFS Tree Traversal**

DFS is implemented by this tutorial: https://www.youtube.com/watch?v=cWNEl4HE2OE.

The graph gets turned into an adjacent list with a HashMap. It basically acts like a linked list with different objects/Areas being "connected" together by string ids. 

**Shallow**

Using a linked list-like for a graph that's immutable is extremely inefficient for large quantities, so I treated it like an array.

And, I don't even need to go that deep for my game. I just wanted the players to move 1 area at a time, I don't need to implement a DFS.

This method takes that adjacent list and treats it as an array to be iterated through, meaning it has O(n) instead of O(V + E).
This is a 4.02x improvement over DFS.

This removes the looping of the graph from the top for every function. The functions only rely on single values now, making the loop the responsibility of the code that called the function.

**HashMap Approach (Future)**

There is now a location value string set inside the Players object. I could use that to directly access the node I want to go to via HashMap and do movement, damage comparisons, and other stuff there. It could remove the need to be worried for the size of the adjacent list and turn it from O(n) into O(1). 

I would need to keep track of the players though so I have to do another array pointing to the players objects to be able to search through the adjacent list. This doubles size consumption to the players. Though, it *is* a good tradeoff since the number of players will be significantly lower than the number of areas. (1 player => 20 areas proportions)

I could just switch out the shallow approach with the hashmap approach when the areas get big enough.

I will do this if it's worth it and if the scope of the project widens, but for now, I am not doing it. It's already fast enough.