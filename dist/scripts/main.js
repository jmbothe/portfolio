

jQuery(($) => {
  const model = {};

  const view = {
    windowIsShortLandscape: function windowIsShortLandscape() {
      const width =
        Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const height =
        Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      return (width / height) >= (4 / 3);
    },

    hideProject: function hideProject(current, target) {
      if (this.windowIsShortLandscape()) {
        target.children('h3, .project-links').animate({opacity: 0}, 300);
      }
      current.addClass('project-collapse');
      setTimeout(() => {
        current.addClass('project-hide');
        if (this.windowIsShortLandscape()) {
          current.css('opacity', 0).animate({opacity: 1}, 300);
        }
      }, 400);
    },

    showProject: function showProject(current, target) {
      target.removeClass('project-hide');
      if (this.windowIsShortLandscape()) {
        target.children('h3, .project-links').css('opacity', 1);
      }
      setTimeout(() => {
        target.removeClass('project-collapse');
      }, 400);
    },
  };

  const controller = {
    initialize: function initialize() {
      this.setupListeners();
    },

    setupListeners: function setupListeners() {
      $('.projects-grid').on('click', '.project-hide', this.toggleProject);
    },

    toggleProject: function toggleProject(e) {
      const current = $('.project-shell:not(.project-hide)');
      const target = $(e.target).closest('.project-hide');
      const animationAlreadyInProgress = $('.project-collapse').length === 4;

      if (animationAlreadyInProgress) {
        return;
      }

      view.hideProject(current, target);
      setTimeout(() => {
        view.showProject(current, target);
      }, 400);
    },
  };

  controller.initialize();
});
