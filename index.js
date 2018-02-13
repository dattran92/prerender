var FS = require('fs');
var Path = require('path');
var mkdirp = require('mkdirp');
var compileToHTML = require('./lib/compile-to-html');

const saveFile = (folder, prerenderedHTML) => {
  console.log('Saving to', folder);
  return new Promise((resolve, reject) => {
    mkdirp(folder, (error) => {
      if (error) {
        return reject('Folder could not be created: ' + folder + '\n' + error);
      }

      var file = Path.join(folder, 'index.html');

      FS.writeFile(
        file,
        prerenderedHTML,
        (error) => {
          if (error) {
            return reject('Could not write file: ' + file + '\n' + error);
          }
          return resolve();
        }
      );
    });
  });
};

function Prerender(paths, options) {
  this.paths = paths
  this.options = options || {}
}

Prerender.prototype.process = async function() {
  const promises = this.paths.map(async (path) => {
    console.log('processing', path.url);
    const prerenderedHTML = await compileToHTML(path.url, this.options);
    const folder = Path.join(this.options.outputDir || './', path.outputPath);
    saveFile(folder, prerenderedHTML);
  });

  await Promise.all(promises);
}

module.exports = Prerender
