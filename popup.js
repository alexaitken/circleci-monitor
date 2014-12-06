var CircleciMonitor = chrome.extension.getBackgroundPage().CircleciMonitor

BranchView = Marionette.ItemView.extend({
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

  openBuild: function(e) {
    e.preventDefault();
    e.stopPropagation();

    chrome.tabs.create({ url: this.model.buildUrl() });
  }

});

BranchesView = Marionette.CollectionView.extend({
  tagName: 'ul',
  itemView: BranchView
});

ErrorView = Marionette.ItemView.extend({
  events: {
    '#retry-authentication click': 'retryAuth',
    '#login-to-circleci click': 'openCircle'
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

ProjectView = Marionette.ItemView.extend({
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
    this.branches = new BranchesView({ collection: this.model.get('branches')});
    this.$('.branches').append(this.branches.render().el);
  },
  onDestroy: function() {
    this.branches && this.branches.destroy();
  },

  addActive: function() {
    this.$el.addClass('active');
  },

  removeActive: function() {
    this.$el.removeClass('active');
  }
});

ProjectsView = Marionette.CollectionView.extend({
  tagName: 'div',
  itemView: ProjectView,
});

ProjectTabView = Marionette.ItemView.extend({
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

ProjectTabsView = Marionette.CollectionView.extend({
  tagName: 'ul',
  itemView: ProjectTabView,
  modelEvents: {
    'select:one': 'render'
  }
});

$(function () {
  if (CircleciMonitor.user.isLoaded()) {
    var recentProject = CircleciMonitor.projects.focusedProject();
    recentProject.select();
    $('#project-tabs').append(new ProjectTabsView({ collection: CircleciMonitor.projects }).render().el);
    $('#branches').append(new ProjectsView({ collection: CircleciMonitor.projects }).render().el);
  } else {
    $('#branches').append(new ErrorView().render().el);
  }
});
