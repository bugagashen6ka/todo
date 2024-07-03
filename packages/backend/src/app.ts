import mongoose from "mongoose";
import { ExpressServer } from "./server";

(() => {
  main();
})();

async function main(): Promise<void> {
  await mongoose.connect("mongodb://localhost:27017/todo");
  const server = new ExpressServer({
    port: 3001,
  });
  await server.start();
}
