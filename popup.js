document.addEventListener("DOMContentLoaded", function() {
  chrome.extension.getBackgroundPage().CircleciMonitor.startView(document);
});
function cleanUpView() {
  chrome.extension.getBackgroundPage().CircleciMonitor.cleanViews();
  removeEventListener("unload", cleanUpView)
}
addEventListener("unload", cleanUpView);
