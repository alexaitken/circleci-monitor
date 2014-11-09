var CircleciMonitor = {
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

    this.recentBuilds = new RecentBuilds([], {
      user: this.user
    });

    this.recentBuilds.on('reset', this.showBuildStatus, this);
    this.projects.on('reset', this.showProjects, this);
    this.projects.on('reset', function() { this.recentBuilds.fetch({reset: true}); }, this);
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
    chrome.browserAction.setBadgeText({ text: '' + this.projects.branchCount() });
    this.delayReload();
  },

  showBuildStatus: function() {
    var iconName = this.icons[this.recentBuilds.recentStatus()] || this.icons.other;
    chrome.browserAction.setIcon({
      path: {
        '19':'images/' + iconName + '-19.png',
        '38':'images/' + iconName + '-38.png'
      }
    });
  },

  delayReload: function() {
    _.delay(this.projects.fetch.bind(this.projects, { reset: true }), 30000);
  }
};

CircleciMonitor.start();
