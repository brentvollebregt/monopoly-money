import * as fs from "fs";
import { routePaths } from "../src/constants";

export const rootDestinations = Object.values(routePaths)
  .filter((p) => p !== "/")
  .map((p) => p.replace(/^\//g, ""));

// Create a 404 fallback for GitHub Pages
fs.copyFile("build/index.html", `build/404.html`, (err) => {
  if (err) throw err;
  console.log(`Copied build/index.html to build/404.html`);
});

// Copy index.html to path folders to be served by GitHub Pages
rootDestinations.forEach((dest) => {
  const fullDestination = `build/${dest}`;
  if (!fs.existsSync(fullDestination)) {
    fs.mkdirSync(fullDestination);
  }
  fs.copyFile("build/index.html", `${fullDestination}/index.html`, (err) => {
    if (err) throw err;
    console.log(`Copied build/index.html to ${fullDestination}/index.html`);
  });
});
