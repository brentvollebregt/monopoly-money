import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs from "fs";
import { routePaths, siteUrl } from "../src/constants";

export const rootDestinations = Object.values(routePaths)
  .filter((p) => p !== "/")
  .map((p) => p.replace(/^\//g, ""));

const links = rootDestinations.map((dest) => ({ url: `${dest}`, priority: 0.8 }));

const stream = new SitemapStream({ hostname: siteUrl });
streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
  fs.writeFileSync("./public/sitemap.xml", data);
  console.log("Sitemap created.");
});
