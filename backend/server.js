var async = require('async');
var express = require("express");
var remoteGit = require("./remote_git")
var branchStatus = require("./branch_status")
var buildLister = require("./build_lister")
var buildPresenter = require("./build_presenter")

var app = express();
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(express.bodyParser());
app.use(allowCrossDomain);

var repoList = function (owner, callback) {
  var repos = require('./repos.json');
  async.reduce(repos, [], function(memo, item, callback) {
    var splitRepo = item.repo.split('/');
    var ownerName = splitRepo[0];
    var repoName = splitRepo[1];
    var repo = { owner: ownerName, repo: repoName };

    if (owner) {
      if (owner == ownerName) memo.push(repo);
    } else {
      memo.push(repo);
    }

    callback(null, memo);
  }, function(err, results) {
    callback(results);
  });
}

var initServer = function (onBranchPush) {
  app.post('/pushed', function(req, res) {
    var content = JSON.parse(req.body.payload);
    console.log("Repo pushed: " + content.repository.name);
    res.send(200, "I'm in your githubs, reading your codez");
    console.log(content.repository.owner.name);
    onBranchPush(content.repository, content.after);
  });

  app.get('/', function (req, res) {
    console.log("Root hit");
    repoList(null, function (results) {
      res.send(200, results);
    });
  });

  app.get('/:owner', function (req, res) {
    console.log("owner hit");
    repoList(req.params.owner.toLowerCase(), function (results) {
      res.send(200, results);
    });
  });

  app.get('/:owner/:repo', function (req, res) {
    var repoOwner = req.params.owner;
    var repoName = req.params.repo;
    branchStatus.listOfBranches(repoOwner, repoName, function (results) {
      res.send(200, results);
    });
  });

  app.get('/:owner/:repo/:branch', function (req, res) {
    var repoOwner = req.params.owner;
    var repoName = req.params.repo;
    var branch = req.params.branch;

    buildLister.listBuilds(repoOwner, repoName, branch, function (results) {
      res.send(200, results);
    })
  });

  app.get('/:owner/:repo/:branch/:build', function (req, res) {
    var repoOwner = req.params.owner;
    var repoName = req.params.repo;
    var branch = req.params.branch;
    var build = req.params.build;

    buildPresenter.build(repoOwner, repoName, branch, build, function (results) {
      res.send(200, results);
    });
  });

  app.listen(1337);
}

exports.initServer = initServer;
