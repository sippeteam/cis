//dependencies
var exec = require('child_process').exec;
var fs = require('fs');

//local files
var localGit = require("./local_git");
var server = require("./server");
var remoteGit = require("./remote_git");

server.initServer(function (repository, sha) {
  var repoConfig = checkRepoList(repository);
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
    if (repoConfig.token && repoConfig.username) {
      remoteGit.updateCommitStatus(sha, status, repository, repoConfig, next);
    } else {
      next();
    }
  });
}

var checkRepoList = function (repository) {
  var sentRepo = repository.owner.name + "/" + repository.name;
  var repos = require('./repos.json');
  console.log(repos);
  var matching = repos.filter(function (repo) {
    return repo.repo.toLowerCase() === sentRepo.toLowerCase();
  });
  console.log(matching);

  if (matching.length === 1) {
    return matching[0];
  } else if (matching.length === 0) {
    console.log("Received request for " + sentRepo + " but no matching repo definition.");
  } else {
    console.log("Ambiguous match for " + sentRepo);
  }
}

var handleBranch = function (repository, repoConfig, branch) {
  console.log("There was a push to " + branch.name + " with " + branch.commit.sha);
  localGit.prepareRepository(repository, branch, repoConfig, executeScript);
}