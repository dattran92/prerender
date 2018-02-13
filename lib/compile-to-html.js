var Path = require('path')
var Phantom = require('phantomjs-prebuilt')
var ChildProcess = require('child_process')

const getHtml = (path, options, callback) => {
  var maxAttempts = options.maxAttempts || 5
  var attemptsSoFar = 0;

  var phantomArguments = [
    Path.join(__dirname, 'phantom-page-render.js'),
    path,
    JSON.stringify(options)
  ];

  if (options.phantomOptions) {
    phantomArguments.unshift(options.phantomOptions)
  }

  function capturePage() {
    attemptsSoFar += 1

    ChildProcess.execFile(
      Phantom.path,
      phantomArguments,
      { maxBuffer: 1048576 },
      (error, stdout, stderr) => {
        if (error || stderr) {
          // Retry if we haven't reached the max number of capture attempts
          if (attemptsSoFar <= maxAttempts) {
            return capturePage()
          } else {
            if (error) return callback(null, error);
            if (stderr) return callback(null, stderr);
          }
        }
        callback(stdout);
      }
    )
  }

  capturePage();
};

module.exports = (path, options) => {
  return new Promise((resolve, reject) => {
    return getHtml(path, options, (compiledHTML, error) => {
      if (error) return reject(error);
      return resolve(compiledHTML);
    });
  });
};
