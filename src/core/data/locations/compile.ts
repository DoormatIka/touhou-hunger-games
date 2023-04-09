import { ds_rooms, ds_gates, ds_routes } from "./humanvillage/dragonstatue.js"
import { field1_gates, field1_rooms, field1_routes } from "./humanvillage/fields/hiedafields.js"
import { hh_gates, hh_rooms, hh_routes } from "./humanvillage/hiedahouse.js"
import { ss_rooms, ss_gates, ss_routes } from "./humanvillage/smallshrine.js";
import { houses_rooms, houses_routes, houses_gates } from "./humanvillage/houses.js";
import { v_fields_rooms, v_fields_gates, v_fields_routes } from "./humanvillage/fields/villagefields.js";
import { kappa_gates, kappa_rooms, kappa_routes } from "./humanvillage/kappawarehouse.js";
import { geidontei_gates, geidontei_rooms, geidontei_routes } from "./humanvillage/geidontei.js";
import { suzunaan_gates, suzunaan_rooms, suzunaan_routes } from "./humanvillage/suzunaan.js";

import { combineSubLocations } from "./location.js";
import { writeFileSync } from "fs";
import chalk from "chalk";

console.log(`${chalk.green("Making human_village graph")}`)
const human_village = combineSubLocations( // combineSubLocations can be hard coded, saving CPU time
  { name: "Hieda Fields", objects: field1_rooms, routes: field1_routes, gate: field1_gates },
  { name: "Dragon Statue", objects: ds_rooms, routes: ds_routes, gate: ds_gates },
  { name: "Hieda House", objects: hh_rooms, routes: hh_routes, gate: hh_gates },
  { name: "Small Shrine", objects: ss_rooms, routes: ss_routes, gate: ss_gates },
  { name: "Houses", objects: houses_rooms, routes: houses_routes, gate: houses_gates },
  { name: "Village Fields", objects: v_fields_rooms, routes: v_fields_routes, gate: v_fields_gates },
  { name: "Kappa", objects: kappa_rooms, routes: kappa_routes, gate: kappa_gates },
  { name: "Geidontei", objects: geidontei_rooms, routes: geidontei_routes, gate: geidontei_gates },
  { name: "Suzunaan", objects: suzunaan_rooms, routes: suzunaan_routes, gate: suzunaan_gates },
);

console.log(`${chalk.green("Writing to humanvillage.json")}`)
writeFileSync(__dirname + "/compiled/humanvillage.json", JSON.stringify(human_village, undefined, 2));