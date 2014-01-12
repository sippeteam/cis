var github = require('octonode');


var checkBranchesForChanges = function (repository, sha, repoConfig, handleBranchCallback) {
  var remote = initializeGithubRepo(repository, repoConfig);

  remote.branches(function (err, data, headers) {
    data.forEach(function (branch) {
      if (branch.commit.sha == sha) {
        handleBranchCallback(repository, repoConfig, branch);
      }
    });
  });
}

var updateCommitStatus = function (sha, status, repository, repoConfig, next) {
  var ghrepo = initializeGithubRepo(repository, repoConfig);

  var statusString;
    if (status) {
      statusString = "success";
    }

  var statusString = (status)
    ? "success"
      : "failure"

  ghrepo.status(sha, {
    "state": statusString,
    "target_url": "http://www.google.com",
    "description": "Build " + statusString + "."
  }, function() {});

  console.log("Updated commit status with status of: "+ statusString);

  next();
}

var initializeGithubRepo = function (repository, repoConfig) {
  var client = github.client(repoConfig.token);

  var repoName = repository.name;
  var owner = repository.owner.name;

  var repo = client.repo(owner + "/" + repoName);
  console.log("github repo:");
  console.log(repo);
  return repo;
}

exports.checkBranchesForChanges = checkBranchesForChanges;
exports.updateCommitStatus = updateCommitStatus;
exports.initializeGithubRepo = initializeGithubRepo;
