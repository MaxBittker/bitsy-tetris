// https://github.com/seleb/bitsy-boilerplate

import fs from "fs";
import getCss from "./getCss";
import optimize from "@bitsy/optimizer";
import optimizeOptions from "./input/optimization";

const fsp = fs.promises;

const fontName = "ascii_small";

async function build() {
  const title = await fsp.readFile("./input/title.txt");
  const gamedata = await fsp.readFile("./input/gamedata.txt", "utf8");

  const template = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/other/exportTemplate.html",
    "utf8"
  );
  const bitsy = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/bitsy.js"
  );
  const font = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/font.js"
  );
  const dialog = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/dialog.js"
  );
  const script = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/script.js"
  );
  const color_util = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/color_util.js"
  );
  const transition = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/transition.js"
  );
  const renderer = await fsp.readFile(
    "./node_modules/Bitsy/editor/shared/script/renderer.js"
  );
  const fontData = await fsp.readFile(
    `./node_modules/Bitsy/editor/shared/bitsyfont/${fontName}.bitsyfont`
  );

  const css = await getCss("./input/style.css");
  const { default: buildHacks } = await import("@bitsy/hecks");

  const builtHacks = await buildHacks(["./input/hacks.js"]);
  //   console.log(builtHacks);
  const config = {
    "@@T": title,
    "@@D": gamedata,
    "@@C": css,
    "@@U": color_util,
    "@@X": transition,
    "@@F": font,
    "@@S": script,
    "@@L": dialog,
    "@@R": renderer,
    "@@E": bitsy,
    "@@N": fontName,
    "@@M": fontData,
    "</head>": `
	<audio id="short" src="./short.ogg" loop></audio>
	<audio id="longer" src="./longer.mp3" loop></audio>
	<script>
	 ${builtHacks[0]} 
	 </script>
	  </head>`
  };

  const html = Object.entries(config).reduce(
    (result, [key, value]) => result.replace(key, value),
    template
  );
  await fsp.writeFile("./index.html", html);
}

build()
  .then(() => console.log("👍"))
  .catch(err => console.error("👎\n", err));
