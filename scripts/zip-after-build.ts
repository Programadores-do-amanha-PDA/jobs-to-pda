import { zip } from "zip-a-folder";
import { existsSync, mkdirSync } from "fs";

const target = process.env.TARGET || "chrome";

async function createZip() {
  console.log("creating extension archive...");

  try {
    // Create releases folder if it doesn't exist
    if (!existsSync("./releases")) {
      mkdirSync("./releases", { recursive: true });
      console.log("releases folder created");
    }

    await zip("dist", `./releases/jobs-to-pda-${target}.zip`);
    console.log(`built jobs-to-pda-${target}.zip`);
  } catch (error) {
    console.error("error creating archive:", error);
    process.exit(1);
  }
}

createZip();
