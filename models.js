User = Backbone.Model.extend({
  url: 'https://circleci.com/api/v1/me',

  isLoaded: function() {
    return this.get('login') !== undefined;
  }
});

Project = Backbone.Model.extend({
  initialize: function(attributes, options) {
    var selectable = new Backbone.Picky.Selectable(this);
    _.extend(this, selectable);

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
    var selectable = new Backbone.Picky.SingleSelect();
    _.extend(this, selectable);

    this.user = options.user;

    this.listenTo(this, "reset", this.reselect);
    this.listenTo(this, "select:one", this.storeSelection);
  },

  parse: function(response) {
    return _.map(response, function(project) {
      var projectUrl = extractUrl(project);
      return {
        username: project.username,
        reponame: project.reponame,
        branches: _.map(project.branches, function(v, k) {
          v.name = k;
          v.projectUrl = projectUrl;
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

  branchOrder: function() {
    return -this.recentBuildNumber();
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

RecentBuild = Backbone.Model.extend({
});

RecentBuilds = Backbone.Collection.extend({
  model: RecentBuild,
  url: 'https://circleci.com/api/v1/recent-builds?limit=50',

  initialize: function(models, options) {
    this.user = options.user;
  },

  recentStatus: function() {
    if (!this.first()) { return null; }
    return this.first().get('status');
  },

  recentProject: function() {
    if (!this.first()) { return null; }

    return this.first().get('username') + '/' + this.first().get('reponame');
  },

  parse: function(response) {
    return response.filter(function(build) {
      return (build.user && build.user.login === this.user.get('login') && build.branch !== 'master');
    }.bind(this));
  }
});

function extractUrl(project) {
  return _.last(project.vcs_url.split('/'), 2).join('/');
}
