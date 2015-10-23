var postcss = require('postcss');
var fs = require('fs');

var transform = postcss(function(css) {
  css.eachRule(function (rule) {
    if (rule.selector === 'body' || rule.selector === 'html') {
      rule.removeSelf();
    } else {
      rule.selector = rule.selector.split(/,/).map(function(selector) {
        return '.ons-css ' + selector;
      }).join(', ');
    }
  });
});

module.exports = function(lang) {
  return function(files, matalsmith, done) {
    setImmediate(done);

    var css1 = fs.readFileSync(__dirname + '/../OnsenUI/build/css/onsen-css-components.css', 'utf8');
    var css2 = fs.readFileSync(__dirname + '/../2/OnsenUI/build/css/onsen-css-components.css', 'utf8');

    var header = '/* NOTE: This css file is NOT original onsen-css-components.css. */\n';
    var file1 = {};
    var file2 = {};
    file1.contents = new Buffer(header + transform.process(css1.toString('utf8')).css);
    file2.contents = new Buffer(header + transform.process(css2.toString('utf8')).css);

    files['reference/onsen-css-components.css'] = file1;
    files['2/reference/onsen-css-components.css'] = file2;
  };
};
