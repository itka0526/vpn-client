import fs from "fs";
import matter from "gray-matter";
import { config } from "./config";
import path from "path";

export function getInstructions() {
    const fileNames = fs.readdirSync(config.guideDir);
    const allData = fileNames.map((fileName) => {
        const guideName = fileName.replace(/\.md$/, "");
        const fullPath = path.join(config.guideDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);
        return {
            guideName,
            ...(matterResult.data as { date: string; title: string }),
        };
    });
    return allData;
}
