import { krogerAPI } from "./krogerAPI.ts";

krogerAPI.getLocations('46074').then((tokens) => {
  console.log(tokens);
});