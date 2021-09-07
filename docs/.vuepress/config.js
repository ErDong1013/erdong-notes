const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const utc = require('dayjs/plugin/utc');
dayjs.extend(localizedFormat);
dayjs.extend(utc);

const markdownItAttrs = require('markdown-it-attrs');
const { slugify } = require('transliteration');

const { sidebarStructure } = require('../note/nav');
// => { [groupName: string]: string[] }

// * ---------------------------------------------------------------- sidebar

const docFolder = path.resolve(process.cwd(), './docs');
const noteFolder = path.resolve(docFolder, './note');
const hasFile = (e) => fs.existsSync(path.resolve(noteFolder, e));
const toNavUrl = (url) => path.resolve('/note', url);

// * --------------------------------

const urlFix = (e) => (e === '/note' ? '/note/' : e);

const articleSidebar = Object.entries(sidebarStructure)
  .map(([groupName, list]) => [groupName, list.filter(hasFile)])
  .filter(([, list]) => list.length > 0)
  .map(([g, list]) => [g, list.map(toNavUrl)])
  .map(([title, children]) => [title, children.map(urlFix)])
  .map(([title, children]) => ({ title, children, collapsable: false }));
// => [{ title, children: string[], collapsable }]

// * ----------------

const navCateOfFirst = articleSidebar.map(({ title: text, children: [link] }) => ({ text, link }));
// => [{ text, link }]

// * ---------------------------------------------------------------- config

const config = {
  title: '前端指南',
  description: '前端技术学习指南',
  head: [['link', { rel: 'icon', type: 'image/jpg', href: '/js-nation-square-blue.png' }]],

  dest: './public',

  theme: 'vdoing',

  themeConfig: {
    author: {
      name: 'ErDong',
      link: 'https://github.com/MuBai1104',
    },
    blogger: {
      avatar: 'https://tva1.sinaimg.cn/large/008i3skNly1gsueeuixx5j31400u0433.jpg',
      name: 'ErDong',
      slogan: '略懂点前端',
    },
    social: {
      icons: [
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/MuBai1104',
        },
      ],
    },
    footer: {
      createYear: 2021,
      copyrightInfo:
        'ErDong | <a href="https://github.com/MuBai1104/erdong-notes/blob/master/LICENSE" target="_blank">MIT License</a>',
    },

    bodyBgImg: [
      'https://images.unsplash.com/photo-1561160767-6bbd75de51b8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2851&q=80',
    ],
    bodyBgImgOpacity: 0.1,

    contentBgStyle: 6,

    lastUpdated: '上次更新',
    // editLinks: true,

    nav: [
      { text: '指南', link: '/note/typescript' },
      { text: 'Interview', link: '/interview/JavaScript' },
      { text: '关于我', link: '/about/' },
      { text: '归档', link: '/archives/' },
    ],
    repo: 'MuBai1104/erdong-notes',

    sidebarDepth: 3,
    sidebar: {
      '/note': articleSidebar,
      '/interview': articleSidebar,
      '/about': false,
    },
    // Algolia 搜索
    // algolia: {
    //   apiKey: '<API_KEY>',
    //   indexName: '<INDEX_NAME>',
    // },
  },

  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          return dayjs
            .utc(timestamp)
            .utcOffset(8)
            .format('lll');
        },
      },
    ],
    'vuepress-plugin-smooth-scroll',
    [
      'vuepress-plugin-zooming',
      {
        selector: 'img',
        delay: 1000,
        options: {
          bgColor: 'hsla(0, 0%, 0%, 0.1)',
          // zIndex: 10000,
        },
      },
    ],
    'vuepress-plugin-mermaidjs',
  ],
  cache: false,
  markdown: {
    // https://v1.vuepress.vuejs.org/guide/markdown.html#advanced-configuration
    // options for markdown-it-anchor
    anchor: {
      level: 2,
      slugify: (str) => slugify(str),
    },
    extendMarkdown: (md) => {
      md.set({ breaks: true });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '```plantuml',
        closeMarker: '```',
        diagramName: 'uml',
        imageFormat: 'svg',
      });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '@startditaa',
        closeMarker: '@endditaa',
        diagramName: 'ditaa',
      });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '@startgantt',
        closeMarker: '@endgantt',
        diagramName: 'gantt',
      });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '@startmindmap',
        closeMarker: '@endmindmap',
        diagramName: 'mindmap',
      });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '@startwbs',
        closeMarker: '@endwbs',
        diagramName: 'wbs',
      });
      md.use(markdownItAttrs, {
        leftDelimiter: '{',
        rightDelimiter: '}',
      });
    },
  },
  extendPageData($page) {
    const p = $page;

    // * ---------------- fix markdown-it-attrs for sidebar

    const removeAnchorAttr = (str) => str.replace(/\s{[^}]*}\s*$/, '');

    if (p.title) {
      p.title = removeAnchorAttr(p.title);
    }

    if (p.headers) {
      p.headers.forEach((h) => {
        h.title = removeAnchorAttr(h.title);
      });
    }

    // * ----------------
  },
};

// * ---------------------------------------------------------------- output

module.exports = config;
