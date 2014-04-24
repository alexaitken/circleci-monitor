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

$(function () {
  $('#branches').append(new BranchesView({ collection: CircleciMonitor.branches }).render().el);
});
