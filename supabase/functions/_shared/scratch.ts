import "https://deno.land/x/dotenv/load.ts";
import { krogerAPI } from "./krogerAPI.ts";

krogerAPI.getAppTokens().then((tokens) => {
  console.log(tokens);
});