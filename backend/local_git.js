var gift = require("gift");
var async = require("async");
var wrench = require("wrench");
var uuid = require('node-uuid');

var cloneOrInit = function (url, path, repoConfig, next) {
  var repo;
  if (repoConfig.token && repoConfig.username) {
    url = url.replace("https://","https://"+repoConfig.username+":"+repoConfig.token+"@");
  }
  gift.clone(url, path, function (err, _repo) {
    if (err) {
      repo = gift(path);
      console.log(err);
      console.log("(Assuming repo already exists, using existing)");
    } else {
      repo = _repo;
    }

    fetch(repo, next);
  });
}

var fetch = function (repo, next) {
  repo.remote_fetch("", function (err) {
    if (!err) {
      console.log("Fetched ");
    }
    next();
  })
}

var checkout = function (jobRepoPath, sha, next) {
  gift(jobRepoPath).checkout(sha, function (err) {
    if (!err) {
      console.log("Checked out yo");
    } else {
      console.log("Failed checkout :(")
    }
    next();
  })
}

var spawnJobRepo = function (masterRepoPath, jobRepoPath, next) {
  wrench.mkdirSyncRecursive(jobRepoPath, 0777);
  console.log(masterRepoPath);
  wrench.copyDirSyncRecursive(masterRepoPath, jobRepoPath, {
    forceDelete: true
  });
  next();
}

var prepareRepository = function(repository, branch, repoConfig, callback) {
  var sha = branch.commit.sha;
  jobId = new Date().getTime();
  var owner = repository.owner.name;
  var repoName = repository.name;
  var repoUrl = repository.url;
  var masterRepoPath = './repos/' + owner + "/" + repoName;
  var jobPath = './jobs/' + owner + "/" + repoName + "/" + branch.name + "/" + jobId;
  var jobRepoPath = jobPath + '/' + repoName;

  async.series([
    function (next) { cloneOrInit(repoUrl, masterRepoPath, repoConfig, next);    },
    function (next) { spawnJobRepo(masterRepoPath, jobRepoPath, next);   },
    function (next) { checkout(jobRepoPath, sha, next);  },
    function (next) { callback(jobPath, jobRepoPath, sha, repository, repoConfig, next); },

    function (next) { cleanUp(jobRepoPath, next) }
    ]
  );
}

var cleanUp = function (path, next) {
  wrench.rmdirSyncRecursive(path, function () {});

  console.log("Cleaned up.");
}

exports.prepareRepository = prepareRepository;
