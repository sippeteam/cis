var async = require("async");
var fs = require("fs");

var build = function (repoOwner, repoName, branch, build, callback) {
  var path = "./jobs/" + repoOwner + "/" + repoName + "/" + branch + "/" + build;

  var result;
  try {
    result = require(path + "/result.json");
  } catch (err) {
    result = null;
  }
  var status = (result) ? result.status : "pending";

  fs.readFile(path + "/stdout", 'utf8', function (err, stdoutContents) {
    fs.readFile(path + "/stderr", 'utf8', function (err, stderrContents) {
      callback( {"status" : status, "stdout" : stdoutContents, "stderr" : stderrContents } );
    });
  });
}

exports.build = build;

