/* eslint-disable no-console */

import {execa} from "execa";
import fs from "fs";
import os from "os";

(async () => {
    try {
        const isWin = os.platform() === "win32";
        await execa("git", ["checkout", "--orphan", "gh-pages"]);
        // eslint-disable-next-line no-console
        console.log("Building started...");
        await execa("npm", ["run", "build"]);
        // Understand if it's dist or build folder
        const folderName = fs.existsSync("dist") ? "dist" : "build";
        await execa("git", ["--work-tree", folderName, "add", "--all"]);
        await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
        console.log("Pushing to gh-pages...");
        await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
        if (isWin) {
            await execa("Remove-Item", ["-LiteralPath", folderName, "-Force", "-Recurse"]);
        } else {
            await execa("rm", ["-r", folderName]);
        }
        await execa("git", ["checkout", "-f", "master"]);
        await execa("git", ["branch", "-D", "gh-pages"]);
        console.log("Successfully deployed, check your settings");
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message);
        process.exit(1);
    }
})();