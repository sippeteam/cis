//dependencies
var exec = require('child_process').exec;
var fs = require('fs');

//local files
var localGit = require("./local_git");
var server = require("./server");
var remoteGit = require("./remote_git");
var config = require("./config")

console.log("starting up!");

server.initServer(function (repository, sha) {
  var repoConfig = config.checkRepoList(repository);
  console.log(repoConfig);
  if (repoConfig) {
    remoteGit.checkBranchesForChanges(repository, sha, repoConfig, handleBranch);
  }
});

var executeScript = function (path, repoPath, sha, repository, repoConfig, next) {
  exec(repoPath + "/build.sh", function (err, stdout, stderr) {
    var status = !err;

    fs.writeFile(path + "/stdout", stdout, function (err) {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFile(path + "/stderr", stderr, function (err) {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFile(path + "/result.json", "{\"status\" : " + status + " }", function (err) {
      if (err) {
        console.log(err);
      }
    });
    if (repoConfig.token && repoConfig.username) {
      remoteGit.updateCommitStatus(sha, status, repository, repoConfig, next);
    } else {
      next();
    }
  });
}

var handleBranch = function (repository, repoConfig, branch) {
  console.log("There was a push to " + branch.name + " with " + branch.commit.sha);
  localGit.prepareRepository(repository, branch, repoConfig, executeScript);
}
