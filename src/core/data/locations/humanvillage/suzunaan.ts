export const suzunaan_rooms: string[] = [
  "Suzunaan Door",
  "Reception",
  "Generalities Section",
  "Religion Section",
  "History Section",
  "Literature Section"
]

export const suzunaan_routes: string[][] = [
  ["Suzunaan Door", "Reception"],
  ["Reception", "Generalities Section"], // gets players stuck in a loop
  ["Generalities Section", "Religion Section"],
  ["Generalities Section", "History Section"],
  ["Generalities Section", "Literature Section"],
  ["Literature Section", "History Section"],
  ["Literature Section", "Religion Section"],
  ["History Section", "Religion Section"],

  ["Religion Section", "Reception"],
  ["Literature Section", "Reception"],
  ["History Section", "Reception"]
]

export const suzunaan_gates: string[] = [
  "Suzunaan Door"
]