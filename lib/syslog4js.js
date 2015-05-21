var log4js = require('log4js');
var SysLogger = require('ain2');


function defaultLayout(loggingEvent) {
  var levelStr = (loggingEvent && loggingEvent.level) ? loggingEvent.level.levelStr : undefined;

  if (loggingEvent.data && Array.isArray(loggingEvent.data) && loggingEvent.data.length > 0)
    loggingEvent.data[0] = '[' + levelStr + '] - ' + loggingEvent.data[0];
  else
    loggingEvent.data = '[' + levelStr + '] - ' + loggingEvent.data;

  return log4js.layouts.messagePassThroughLayout(loggingEvent);
}

function syslogAppender(layout, config) {
  layout = layout || defaultLayout;
  var logger = new SysLogger(config);

  var logLevels = {
    5000:  logger.trace,
    10000: logger.debug,
    20000: logger.info,
    30000: logger.warn,
    40000: logger.error,
    50000: logger.error
  };

  return function (loggingEvent) {
    var level = loggingEvent.level.level;
    logLevels[level].call(logger, layout(loggingEvent));
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = log4js.layouts.layout(config.layout.type, config.layout);
  }
  return syslogAppender(layout, config);
}

exports.appender = syslogAppender;
exports.configure = configure;
