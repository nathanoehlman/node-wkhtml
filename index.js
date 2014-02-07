var _ = require('lodash'),
    spawn = require('child_process').spawn

function buildArgs(opts) {
    var args = [],
        options = _.omit(opts, 'destination');
    for (name in options) {
      var value = options.hasOwnProperty(name) ? options[name] : defaults.hasOwnProperty(name) ? defaults[name] : null;
        args.push('--' + name)
      if (value) {
        args.push(value);
      }
    }

    return args;
}


var defaults = module.exports.defaults = function(defaults) {

  var defaultEnv = defaults.env || process.env,
      pdf = defaults.pdf || {},
      png = defaults.png || {};

  return {
    spawn: function(format, input, opts, env) {
      var executable,
          defaults;

      if (format === "pdf") {
        executable = 'wkhtmltopdf'
        defaults = pdf;
      } else if (format == "png") {
        executable = 'wkhtmltoimg'
        defaults = png;
      } else {
        throw "Unsupported format. Use 1 of pdf or png"
      }

      var args = buildArgs(_.extend(defaults, opts || {})),
          destination = (opts.destination ? opts.destination : '-'),
          launchArgs = args.concat([input || '-', destination]);

      return spawn(executable, launchArgs, env || defaultEnv);
    }
  }
}

var wkhtml = defaults({});
module.exports.spawn = wkhtml.spawn;