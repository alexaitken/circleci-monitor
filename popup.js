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
    return data.projectUrl + '<br/>' + decodeURIComponent(data.name);
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
    return '<p class="error">You are not logged into circleci or have a connection problem</p>' +
      '<p><a id="login-to-circleci" href="http://circleci.com/">Log into circleci</a> or <button id="retry-authentication">Retry Authentication</button></p>';
  },

  retryAuth: function() {
    CircleciMonitor.retry();
  },

  openCircle: function() {
    chrome.tabs.create({ url: 'https://circleci.com' });
  }

});

$(function () {
  if (CircleciMonitor.user.isLoaded()) {
    $('#branches').append(new BranchesView({ collection: CircleciMonitor.branches }).render().el);
  } else {
    $('#branches').append(new ErrorView().render().el);
  }
});
