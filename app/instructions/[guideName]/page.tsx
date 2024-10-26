import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { config } from "@/lib/config";

async function getData(guideName: string) {
    const fullPath = path.join(config.guideDir, `${guideName}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        guideName,
        contentHtml,
        ...(matterResult.data as { date: string; title: string }),
    };
}

export async function generateStaticParams() {
    const fileNames = fs.readdirSync(config.guideDir);
    return fileNames.map((fileName) => ({
        guideName: fileName.replace(/\.md$/, ""),
    }));
}

export default async function Guide({ params }: { params: { guideName: string } }) {
    const data = await getData(params.guideName);
    return (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="py-4 sm:py-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">{data.title}</h1>
                <time className="text-gray-400 text-sm" dateTime={data.date}>
                    {new Date(data.date).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </time>
            </header>
            <div className="prose prose-invert prose-lg mx-auto" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        </article>
    );
}
