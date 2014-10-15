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
    this.branches = new Branches([], {
      user: this.user
    });

    this.branches.on('reset', this.showProjects, this);
    this.branches.on('error', this.delayReload, this);

    this.user.on('change', function() { this.branches.fetch({reset: true}); }, this);

    this.user.on('error', function() {
      chrome.browserAction.setIcon({
        imageData: {
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
    chrome.browserAction.setBadgeText({ text: '' + this.branches.branchCount() });

    var iconName = this.icons[this.branches.focusedBuild().status()] || this.icons.other;
    chrome.browserAction.setIcon({
      imageData: {
        '19':'images/' + iconName + '-19.png',
        '38':'images/' + iconName + '-38.png'
      }
    });

    this.delayReload();
  },

  delayReload: function() {
    _.delay(this.branches.fetch.bind(this.branches, { reset: true }), 30000);
  }
};

CircleciMonitor.start();
