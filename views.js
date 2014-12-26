CircleciMonitor.BranchView = Marionette.ItemView.extend({
  tagName: 'li',
  className: function() {
    return this.model.recentBuild().status;
  },
  events: {
    'click': 'openBuild'
  },

  template: function(data) {
    return decodeURIComponent(data.name);
  },

  onClose: function() {
    this.undelegateEvents();
    console.log(this.cid + ' closing view');
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
  },

  openBuild: function(e) {
    e.preventDefault();
    e.stopPropagation();

    chrome.tabs.create({ url: this.model.buildUrl() });
  }

});

CircleciMonitor.BranchesView = Marionette.CollectionView.extend({
  tagName: 'ul',
  onClose: function() {
    this.undelegateEvents();
    console.log(this.cid + ' closing view');
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
  },

  itemView: CircleciMonitor.BranchView
});

CircleciMonitor.ErrorView = Marionette.ItemView.extend({
  events: {
    '#retry-authentication click': 'retryAuth',
    '#login-to-circleci click': 'openCircle'
  },

  onClose: function() {
    this.undelegateEvents();
    console.log(this.cid + ' closing view');
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
  },

  template: function(data) {
    return '<p class="error">You are not logged into CircleCI or have a connection problem</p>' +
      '<p><a id="login-to-circleci" href="http://circleci.com/">Log into circleci</a> or <button id="retry-authentication">Retry Authentication</button></p>';
  },

  retryAuth: function() {
    CircleciMonitor.retry();
  },

  openCircle: function() {
    chrome.tabs.create({ url: 'https://circleci.com' });
  }

});

CircleciMonitor.ProjectView = Marionette.ItemView.extend({
  className: function() {
    var names = ['branches-body'];

    if (this.model.selected) {
      names.push('active');
    }

    return names.join(' ');
  },
  template: function(data) {
    return "<div class='branches'></div>"
  },
  modelEvents: {
    'selected': 'addActive',
    'deselected': 'removeActive'
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
    this.branches = new CircleciMonitor.BranchesView({ collection: this.model.get('branches')});
    this.$('.branches').append(this.branches.render().el);
  },
  onClose: function() {
    console.log(this.cid + ' closing view');
    this.branches && this.branches.close();
    this.undelegateEvents();
  },

  addActive: function() {
    this.$el.addClass('active');
  },

  removeActive: function() {
    this.$el.removeClass('active');
  }
});

CircleciMonitor.ProjectsView = Marionette.CollectionView.extend({
  tagName: 'div',
  onClose: function() {
    console.log(this.cid + ' closing view');
    this.undelegateEvents();
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
  },

  itemView: CircleciMonitor.ProjectView,
});

CircleciMonitor.ProjectTabView = Marionette.ItemView.extend({
  tagName: 'li',
  events: { 'click': 'selectProject' },
  modelEvents: {
    'selected': 'addActive',
    'deselected': 'removeActive'
  },
  className: function() {
    var names = ['project-tab'];

    if (this.model.selected) {
      names.push('active');
    }

    return names.join(' ');
  },

  onClose: function() {
    console.log(this.cid + ' closing view');
    this.undelegateEvents();
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
  },

  template: function(data) {
    return '<span title="' + data.fullName + '">' + data.reponame + '</span>';
  },

  selectProject: function() {
    this.model.select();
  },

  addActive: function() {
    this.$el.addClass('active');
  },

  removeActive: function() {
    this.$el.removeClass('active');
  },

  serializeData: function() {
    var data = this.model.toJSON();
    data.fullName = this.model.fullName();
    return data;
  }
});

CircleciMonitor.ProjectTabsView = Marionette.CollectionView.extend({
  tagName: 'ul',
  itemView: CircleciMonitor.ProjectTabView,
  onClose: function() {
    console.log(this.cid + ' closing view');
    this.undelegateEvents();
  },

  onRender: function() {
    console.log(this.cid + ' opening view');
  },

  modelEvents: {
    'select:one': 'render'
  }
});
