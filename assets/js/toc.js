if (document.getElementById('toc') != null) {
  var tocConf = {
    tocSelector: '#toc',
    contentSelector: '.post-content',
    headingSelector: 'h1, h2, h3',
    hasInnerContainers: true,
    headingsOffset: 800
  };
}

(function(options) {
  toc.init(options) = function() {
    // Remove event listeners.
    if (
      options.scrollContainer &&
      document.querySelector(options.scrollContainer)
    ) {
      document
        .querySelector(options.scrollContainer)
        .removeEventListener('scroll', this._scrollListener, false);
      document
        .querySelector(options.scrollContainer)
        .removeEventListener('resize', this._scrollListener, false);
      if (buildHtml) {
        document
          .querySelector(options.scrollContainer)
          .removeEventListener('click', this._clickListener, false);
      }
    } else {
      document.removeEventListener('scroll', this._scrollListener, false);
      document.removeEventListener('resize', this._scrollListener, false);
      if (buildHtml) {
        document.removeEventListener('click', this._clickListener, false);
      }
    }
  };
})(tocConf);
