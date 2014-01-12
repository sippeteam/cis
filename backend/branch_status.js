var async = require("async");
var fs = require("fs");
var config = require("./config");
var remoteGit = require("./remote_git")




var statusForBranch = function (repoOwner, repoName, branch, callback) {
  var path = "jobs/" + repoOwner + "/" + repoName + "/" + branch;
  console.log("path:" + path);
  fs.readdir(path, function (err, files) {
    if (!files) {
      callback("not tested");
      return;
    }
    files.sort();
    console.log("found folders: " + files);
    var latest = files[files.length - 1];
    var result;
    try {
      console.log("trying to read: " + "./" + path + "/" + latest + "/result.json");
      result = require("./" + path + "/" + latest + "/result.json");
      console.log("got result: " + result);
    } catch (err) {
      result = null;
      console.log("require json error: " + err);
    }
    console.log("result after reading file: " + result);
    var status = (result) ? result.status : "pending";
    callback(status);
  });
}

var listOfBranches = function(repoOwner, repoName, callback) {
  repoOwner = repoOwner.toLowerCase();
  repoName = repoName.toLowerCase();

  var repository = {
    owner: { name: repoOwner },
    name: repoName
  }
  var repoConfig = config.checkRepoList(repository);
console.log("repoConfig:" + repoConfig);
  var remote = remoteGit.initializeGithubRepo(repository, repoConfig);

  remote.branches(function (err, data, headers) {
    async.map(data, function (branch, callback) {
      statusForBranch(repoOwner, repoName, branch.name, function (status) {
        var branchJSON = {
          "branch": branch.name,
          "status": status
        }
        callback(null, branchJSON);
      })
    }, function(err, results) {
      console.log("it's working");
      console.log(results);
      callback(results);
    });
  });
}

exports.listOfBranches = listOfBranches;
