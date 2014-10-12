User = Backbone.Model.extend({
  url: 'https://circleci.com/api/v1/me',

  isLoaded: function() {
    return this.get('login') !== undefined;
  }
});

Branch = Backbone.Model.extend({
  buildUrl: function() {
    return 'https://circleci.com/gh/' + this.get('projectUrl') + '/' + this.recentBuildNumber();
  },

  recentBuildNumber: function() {
    return this.recentBuild().build_num;
  },

  recentBuild: function() {
    result = null;
    if (this.get('running_builds').length > 0) {
      result = _.first(this.get('running_builds'));
    } else {
      result = _.first(this.get('recent_builds'));
    }
    if (this.get('name') === 'master') {
      result.added_at = new Date(0);
    }
    return result;
  },

  status: function() {
    return this.recentBuild().status;
  }
});


Branches = Backbone.Collection.extend({
  model: Branch,
  comparator: function(branch) {
    return branch.get('projectURL') + '/' + branch.get('name');
  },

  url: function() {
    return 'https://circleci.com/api/v1/projects'
  },

  initialize: function(models, options) {
    this.user = options.user;
  },

  parse: function(response) {
    return _.select(this.extractBranches(response), this.branchesThatMatter, this);
  },

  focusedBuild: function() {
    return this.reduce(function(newestBuild, build) {
      if (newestBuild === null || Date.parse(newestBuild.recentBuild().added_at) < Date.parse(build.recentBuild().added_at)) {
        return build;
      }
      return newestBuild;
    }, null);
  },

  extractBranches: function(response) {
    return _.flatten(_.map(response, function(project) {
      var projectUrl = extractUrl(project);
      return _.map(project.branches, function(v, k) {
        v.name = k;
        v.projectUrl = projectUrl;
        return v;
      });
    }));
  },

  branchesThatMatter: function(branch) {
    var username = this.user.get('login');
    return branch.name == 'master' || _.contains(branch.pusher_logins, username);
  },

  branchCount: function() {
    return this.reduce(function(count, build) {
      if (build.get('name') === 'master') {
        return count;
      } else {
        return count + 1;
      }
    }, 0);
  }

});


function extractUrl(project) {
  return _.last(project.vcs_url.split('/'), 2).join('/');
}

