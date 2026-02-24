import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dir = import.meta.dirname;
const files = await readdir(dir);
const pkg = {};

for (const file of files) {
    if (!file.match(/\.svg$/)) {
        continue;
    }
    let fileContents = await readFile(resolve(dir, file), "utf8");

    // These are kinda useless so let's get rid of 'em.
    [
        "stroke-linecap",
        "stroke-linejoin",
        "xmlns:dc",
        "version",
        "xmlns:cc",
        "xmlns:rdf",
    ].forEach(function (attr) {
        fileContents = fileContents.replace(
            new RegExp(" " + attr + '="[^"]+"', "g"),
            "",
        );
    });

    // Replace some colors I've been having trouble with.
    fileContents = fileContents.replace(/#F00/, "#f00");
    fileContents = fileContents.replace(/#800000/, "#800");
    fileContents = fileContents.replace(/<metadata>.*<\/metadata>/, "");

    // Strip out floaters.
    fileContents = fileContents.replace(/(\d+\.\d+)/g, function (a) {
        return Math.round(Number(a));
    });

    pkg[file.replace(".svg", "")] = fileContents;
}

await writeFile(
    resolve(dir, "index.js"),
    "export default " + JSON.stringify(pkg),
);
