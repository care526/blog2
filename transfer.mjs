import { fs } from "zx";
import md5 from "md5";

const RootDir = "./care";
const TargetDir = "./docs";
const sidebarConfig = {};
const navbarConfig = [];

// 核心逻辑
// 删除重建 docs目录
await $`rm -rf ${TargetDir}`;
await $`mkdir -p ${TargetDir}/.vuepress/public`;
await $`cp -r public ${TargetDir}/.vuepress`;

async function dealDir(level, sourceDir, targetDir, parentIndex, parentConfig) {
  const files = await fs.readdir(sourceDir);
  const mds = files.filter((name) => name.includes(".md"));
  const dirs = files.filter(
    (name) => !name.includes(".md") && !["images", ".gitkeep"].includes(name)
  );

  if (level < 2) {
    return Promise.all([
      ...mds.map(async (md) => {
        await $`cp ${sourceDir}/${md} ${targetDir}/${md}`;
      }),
      ...dirs.map(async (dir, index) => {
        if (level === 0) {
          navbarConfig.push({ text: dir, children: [] });
        } else if (level === 1) {
          navbarConfig[parentIndex].children.push({
            text: dir,
            link: "",
          });
        }

        const newTargetDir = `${targetDir}/${index}`;
        await $`mkdir -p ${newTargetDir}`;
        let config;
        if (level === 1) {
          config = parentConfig[`/${parentIndex}/${index}/`] = [];
        }
        await dealDir(
          level + 1,
          sourceDir + "/" + dir,
          newTargetDir,
          index,
          config || parentConfig
        );
      }),
    ]);
  } else {
    return Promise.all([
      ...mds.map(async (md) => {
        const sourceMd = `${sourceDir}/${md}`;
        const targetMd = `${targetDir}/${md5(await fs.readFile(sourceMd))}.md`;
        await $`cp ${sourceMd} ${targetMd}`;
        parentConfig.push({
          text: md.replace(".md", ""),
          link: targetMd.replace("./docs", ""),
        });
        const [_, firts, second] = targetMd.replace("./docs", "").split("/");
        const obj = navbarConfig[firts].children[second];
        if (!obj.link) {
          obj.link = targetMd.replace("./docs", "");
        }
      }),
      ...dirs.map(async (dir, index) => {
        if (
          dir === "images" &&
          !(await fs.stat(`${sourceDir}/${dir}`)).isDirectory
        ) {
          return;
        }

        const children = [];
        parentConfig.push({
          text: dir,
          collapsible: true,
          children,
        });
        await dealDir(
          level + 1,
          sourceDir + "/" + dir,
          targetDir,
          index,
          children
        );
      }),
    ]);
  }
}

await dealDir(0, RootDir, TargetDir, 0, sidebarConfig);

fs.writeFile("navbar.config.json", JSON.stringify(navbarConfig));
fs.writeFile("sidebar.config.json", JSON.stringify(sidebarConfig));

console.log("转换完成");
