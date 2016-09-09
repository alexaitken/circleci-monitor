var CircleciMonitor = {
  _views: [],

  icons: {
    success: 'green',
    fixed: 'green',
    failed: 'red',
    running: 'blue',
    other: 'grey'
  },

  start: function() {
    this.user = new User();

    this.projects = new Projects([], {
      user: this.user
    });

    this.projects.on('reset', this.showProjects, this);
    this.projects.on('reset', this.delayReload, this);
    this.projects.on('error', this.delayReload, this);

    this.user.on('change', function() { this.projects.fetch({reset: true}); }, this);

    this.user.on('error', function() {
      chrome.browserAction.setIcon({
        path: {
          '19': 'images/warning-19.png',
          '38': 'images/warning-38.png'
        }
      });
    });

    this.user.fetch();
  },

  retry: function() {
    this.user.fetch();
  },

  showProjects: function() {
    chrome.browserAction.setBadgeText({ text: '' + this.badgeCount() });

    var iconName = this.icons[this.projects.focusedBuild().status()] || this.icons.other;
    chrome.browserAction.setIcon({
      path: {
        '19':'images/' + iconName + '-19.png',
        '38':'images/' + iconName + '-38.png'
      }
    });
  },

  badgeCount: function() {
    if(this.projects.branchCount() == 0) {
      return '';
    }
    return this.projects.branchCount();
  },

  showBuildStatus: function() {
    var iconName = this.icons[this.branches.focusedBuild().status()] || this.icons.other;
  },

  delayReload: function() {
    _.delay(this.projects.fetch.bind(this.projects, { reset: true }), 30000);
  },

  registerViews: function() {
    _.each(arguments, function(view) { this._views.push(view); }, this);
  },

  cleanViews: function() {
    _.each(this._views, function(view) {
      view.close();
    });
    this._views = [];
  },

  registerAndRender: function(view, domElement) {
    CircleciMonitor.registerViews(view);
    $(domElement).append(view.render().el);
  },

  startView: function(doc) {
    if (CircleciMonitor.user.isLoaded()) {
      var recentProject = CircleciMonitor.projects.focusedProject();
      recentProject.select();

      CircleciMonitor.registerAndRender(new CircleciMonitor.ProjectTabsView({ collection: CircleciMonitor.projects }), doc.getElementById('project-tabs'));
      CircleciMonitor.registerAndRender(new CircleciMonitor.ProjectsView({ collection: CircleciMonitor.projects }), doc.getElementById('branches'));

    } else {
      CircleciMonitor.registerAndRender(new CircleciMonitor.ErrorView(), doc.getElementById('branches'));
    }
  }
};
