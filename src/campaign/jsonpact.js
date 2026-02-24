import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const keys = [];
const campaign = {
    messages: JSON.parse(
        await readFile(resolve(import.meta.dirname, "./messages.json"), "utf8"),
    ),
    levels: [],
};

async function getKeys(levelNum) {
    const json = JSON.parse(
        await readFile(
            resolve(import.meta.dirname, `./level${levelNum}.json`),
            "utf8",
        ),
    );

    json.waves.forEach(function (wave) {
        wave.sprites.forEach(function (sprite) {
            for (const key in sprite) {
                if (keys.indexOf(key) == -1) {
                    keys.push(key);
                }
            }
        });
    });
}

async function encode(levelNum) {
    const json = JSON.parse(
        await readFile(
            resolve(import.meta.dirname, `./level${levelNum}.json`),
            "utf8",
        ),
    );

    json.waves.forEach(function (wave) {
        wave.sprites = wave.sprites.map(function (sprite) {
            return keys
                .map(function (key) {
                    return sprite[key] || "";
                })
                .join(",");
        });
    });
    return json;
}

for (let i = 1; i <= 6; i++) {
    await getKeys(i);
}

for (let i = 1; i <= 6; i++) {
    campaign.levels.push(await encode(i));
}

campaign.keys = keys;

await writeFile(
    resolve(import.meta.dirname, "levels-compiled.json"),
    JSON.stringify(campaign, null, 2),
);
