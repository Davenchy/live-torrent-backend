const { version } = require("../../package.json");

module.exports = {
  title: "Live Torrent Backend",
  description: "The backend project for the live-torrent project",
  base: "/docs/",
  themeConfig: {
    version,
    sidebar: [
      "/",
      "/guide.md",
      {
        title: "APIs",
        collapsable: false,
        children: [
          "/api/errors.md",
          "/api/torrent.md",
          "/api/captions.md",
          "/api/search.md",
          "/api/yts.md"
        ]
      }
    ],
    nav: [
      {
        text: "Guide",
        link: "/guide.md"
      }
    ],
    repo: "Davenchy/live-torrent-backend",
    repoLabel: "Github!",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "Help us improve this page!",
    smoothScroll: true
  }
};
