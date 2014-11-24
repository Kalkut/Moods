var forever = require('forever');
var restartTime = 3;

  var child = new (forever.Forever)('server.js', {
    'spinSleepTime': restartTime * 1000,
    'logFile': 'logs_feedy/',
    'options': []
  });

/*Useless ?*/
child.on('start', function(process, data) {
    console.error('Start script ' + '{' + data + '}');
});

child.on('stop', function(process) {
    console.error('Stop script ');
});


child.on('restart', function(info) {
  console.log('Server is down, will restart in ' + restartTime + ' seconds: ' + info.file);
  var logRestart = function(sec) {
    if (sec < 1) {
      console.log('Server restart now !');
    } else {
      console.log(sec);
      setTimeout(function() { logRestart(sec - 1) }.bind(this), 1);
    }
  }
  logRestart(restartTime);
});

child.on('err', function(err) {
    console.error('Forever raised an error: ' + err);
});

child.on('exit', function(code) {
    console.error('Forever detected script exited with code ' + code);
});

child.start();
forever.startServer(child);
