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

exports.checkRepoList = checkRepoList;
