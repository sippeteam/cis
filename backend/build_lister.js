var fs = require("fs");
var async = require("async");


var listBuilds = function (repoOwner, repoName, branch, callback) {
  var path = "jobs/" + repoOwner + "/" + repoName + "/" + branch;
  fs.readdir(path, function (err, files) {
    if (!files) {
      callback([]);
      return;
    }
    var filteredFiles = files.filter( function (file) {
      return parseInt(file).toString() === file;
    })

    async.map(filteredFiles, function (buildDir, cb) {
      statusForBuild(path, buildDir, function (status) {
        var buildJSON = {
          "build": buildDir,
          "status": status
        }
        cb(null, buildJSON);
      })
    }, function (err, results) {
      console.log("it's working");
      console.log(results);
      callback(results);
    });

  });
}


var statusForBuild = function (path, buildDir, callback) {
  var result;
  try {
    result = require("./" + path + "/" + buildDir + "/result.json");
  } catch (err) {
    result = null;
  }
  var status = (result) ? result.status : "pending";
  callback(status);
}

exports.listBuilds = listBuilds;