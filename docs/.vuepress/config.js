module.exports = {
  title: "Live Torrent Backend",
  description: "The backend project for the live-torrent project",
  themeConfig: {
    sidebar: [
      "/",
      "/guide.md",
      {
        title: "APIs",
        children: ["/torrent", "/captions.md", "/search.md", "/yts.md"]
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
