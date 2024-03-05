import { defineUserConfig } from "vuepress";
import { defaultTheme } from "@vuepress/theme-default";

import sidebarConfig from "./sidebar.config.json";
import navbarConfig from "./navbar.config.json";

export default defineUserConfig({
  lang: "zh-CN",
  title: "care's blog",
  description: "the meaning of my existence",

  base: "./",
  head: [["link", { rel: "icon", href: "/images/logo.jpeg" }]],

  theme: defaultTheme({
    logo: "/images/logo.jpeg",
    navbar: navbarConfig,
    sidebar: sidebarConfig,
  }),
});
