User = Backbone.Model.extend({
  url: 'https://circleci.com/api/v1/me',

  isLoaded: function() {
    return this.get('login') !== undefined;
  }
});

Project = Backbone.Model.extend({
  initialize: function(attributes, options) {
    Backbone.Select.Me.applyTo(this);

    this.user = options.user || (this.collection && this.collection.user)
    this.set('branches', new Branches(_.select(this.get('branches'), this.branchesThatMatter, this), { user: options.user }));
  },

  branchesThatMatter: function(branch) {
    var username = this.user.get('login');
    return branch.name == 'master' || _.contains(branch.pusher_logins, username);
  },

  fullName: function() {
    return this.get('username') + '/' + this.get('reponame');
  }
});

Projects = Backbone.Collection.extend({
  model: Project,
  url: 'https://circleci.com/api/v1/projects',

  initialize: function(models, options) {
    Backbone.Select.One.applyTo(this, models, options);
    this.user = options.user;
  },

  parse: function(response) {
    return _.map(response, function(project) {
      var projectUrl = extractUrl(project);
      var vcsRoot = extractVcsRootService(project);
      return {
        username: project.username,
        reponame: project.reponame,
        branches: _.map(project.branches, function(v, k) {
          v.name = k;
          v.projectUrl = projectUrl;
          v.vcsRoot = vcsRoot;
          return v;
        })
      };
    });
  },

  focusedBuild: function() {
    return this.reduce(function(newestBuild, project) {
      var newBuild = project.get('branches').focusedBuild();
      if (newestBuild === null ||
          Date.parse(newestBuild.recentBuild().added_at) < Date.parse(newBuild.recentBuild().added_at)) {
        return newBuild;
      }
      return newestBuild;
    }, null);
  },

  branchCount: function() {
    return this.reduce(function(count, project) {
      return count + project.get('branches').branchCount();
    }, 0);
  },

  findProjectByName: function(name) {
    return _.first(this.filter(function(project) {
      return project.fullName() === name;
    }));
  },

  focusedProject: function() {
    return this.findProjectByName(this.focusedBuild().get('projectUrl'));
  },

  storeSelection: function(model) {
    this.currentSelection = model.fullName();
  },

  reselect: function() {
    var selection = this.findProjectByName(this.currentSelection);
    if (selection) {
      selection.select();
    }
  }
});

Branch = Backbone.Model.extend({
  buildUrl: function() {
    return 'https://circleci.com/' + this.get('vcsRoot') + '/' + this.get('projectUrl') + '/' + this.recentBuildNumber();
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

  branchOrder: function() {
    return parseInt('-' + this.recentBuildNumber());
  },

  status: function() {
    return this.recentBuild().status;
  }
});

Branches = Backbone.Collection.extend({
  model: Branch,

  comparator: function(branch) {
    return branch.branchOrder();
  },

  initialize: function(models, options) {
    this.user = options.user;
  },

  focusedBuild: function() {
    return this.reduce(function(newestBuild, build) {
      if (newestBuild === null ||
        Date.parse(newestBuild.recentBuild().added_at) < Date.parse(build.recentBuild().added_at)) {
        return build;
      }
      return newestBuild;
    }, null);
  },

  featureBranches: function() {
    return this.reject(function(branch) {
      return branch.get('name') === 'master';
    });
  },

  branchCount: function() {
    return this.featureBranches().length;
  }
});


function extractUrl(project) {
  return _.last(project.vcs_url.split('/'), 2).join('/');
}

function extractVcsRootService(project) {
    var base_vcs_root_url = _.first(project.vcs_url.split('.'), 1);
    // Default to GitHub
    var repoType = "gh";
    if (base_vcs_root_url.indexOf("bitbucket") == -1) {
      repoType = "bb";
    }
    // More root services can be added as `else if`s

    return repoType;
}
