const Prerender = require('./index.js');

(async () => {
  try {
    const paths = [
      { url: 'https://www.instagram.com/yennie.trinh/', outputPath: './dist/homepage' }
    ];

    const prerender = new Prerender(paths);
    await prerender.process();
  } catch (error) {
    console.error('got error', error);
  }
})();
