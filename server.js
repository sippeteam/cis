var express = require("express");

var app = express();
app.use(express.bodyParser());

var initServer = function (onBranchPush) {
  app.post('/pushed', function(req, res) {
    var content = JSON.parse(req.body.payload);
    console.log("Repo pushed: " + content.repository.name);
    res.send(200, "I'm in your githubs, reading your codez");
    console.log(content.repository.owner.name);
    onBranchPush(content.repository, content.after);
  });

  app.listen(1337);
}

exports.initServer = initServer;