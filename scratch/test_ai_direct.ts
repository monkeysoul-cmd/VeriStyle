import dotenv from "dotenv";
dotenv.config();
import { analyzeUrlForensics } from "../api/_analyzer";

async function main() {
  console.log("Analyzing Triggr Horizon Speaker via analyzeUrlForensics...");
  const res = await analyzeUrlForensics("https://www.flipkart.com/triggr-horizon-16-dual-drivers-7hrs-playtime-mems-mic-tws-function-16-w-bluetooth-speaker/p/itm4bdf2555541e2");
  console.log("Full Result:\n", JSON.stringify(res, null, 2));
}

main().catch(console.error);
