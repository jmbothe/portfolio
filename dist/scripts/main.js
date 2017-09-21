jQuery(($) => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  const model = {
    activeSkills: [],

    // in the event I want dimensions that DONT update on viewport changes
    viewHeight: $(window).height(),
    viewWidth: $(window).width(),

    // in the event that I DO want the latest and greatest dimensions
    getAspect: function getAspect() {
      const x = $(window).width();
      const y = $(window).height();

      return { x, y };
    },

    random: function random(min, max) {
      const num = Math.floor(Math.random() * (max - min)) + min;
      return num;
    },

    skillModule: function skillModule() {
      const skillList = [
        'ES6', 'CSS3', 'HTML5', 'Gulp', 'MVC', 'JavaScript', 'Foundation', 'Bootstrap',
        'Node.js', 'npm', 'postcss', 'bash', 'git', 'gitHub', 'Photoshop', 'DRY code',
        'clean code', 'self-documenting code', 'mobile-first', 'responsive design',
        'functional programming', 'object-oriented programming', 'hella APIs',
        'click me', 'Atom', 'Visual Studio Code',
      ];
      this.counter = this.counter || 0;
      this.counter++;
      const skill = skillList[this.counter % skillList.length];

      const colors = ['hsl(290, 6%, 18%)', '#fbf579'];
      const color = colors[this.random(0, colors.length)];

      const aspect = this.getAspect();
      const font =
        this.random((aspect.x / aspect.y) * 20, (aspect.x / aspect.y) * 40);
      context.font = `${font}px sans-serif`;
      const textWidth = context.measureText(skill).width;

      let x = this.random(0, aspect.x - textWidth);
      let y = aspect.y + 60;
      let speed = this.random(1, 4);

      function draw() {
        context.font = `${font}px sans-serif`;
        context.fillStyle = color;
        context.fillText(skill, x, y);
      }

      function update() {
        y -= speed;
      }

      function getY() {
        return y;
      }

      return {
        draw: draw,
        update: update,
        getY: getY,
        skill: skill,
      };
    },
  };

  const view = {
    windowIsShortLandscape: function windowIsShortLandscape() {
      return (model.getAspect().x / model.getAspect().y) >= (4 / 3);
    },

    hideProject: function hideProject(current, target) {
      if (this.windowIsShortLandscape()) {
        target.children('h3, .project-links').animate({ opacity: 0 }, 300);
      }
      current.addClass('project-collapse');
      setTimeout(() => {
        current.addClass('project-hide');
        if (this.windowIsShortLandscape()) {
          current.css('opacity', 0).animate({ opacity: 1 }, 300);
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
      this.canvasLoop();
      this.setViewportHeight();
    },

    setupListeners: function setupListeners() {
      $('.projects-grid').on('click', '.project-hide', this.toggleProject);
      $(window).on('orientationchange', this.updateViewportHeight.bind(this));
    },

    setViewportHeight: function setViewportHeight() {
      $('.hero, .skills').css({ height: model.getAspect().y });
    },

    updateViewportHeight: function updateViewportHeight() {
      model.viewHeight = model.getAspect().y;
      this.setViewportHeight();
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

    canvasLoop: function canvasLoop(updateTime = performance.now()) {
      const width = canvas.width =  model.getAspect().x;
      const height = canvas.height = model.viewHeight;

      context.fillStyle = 'rgba(250, 98, 95, 1)';
      context.fillRect(0, 0, width, height);

      // timing function to create new word
      while(updateTime + 1000 < performance.now()) {
        const skill = model.skillModule();
        model.activeSkills.push(skill);
        updateTime = performance.now();
      }

      for (let j = 0; j < model.activeSkills.length; j++) {
        model.activeSkills[j].draw.call(model);
        model.activeSkills[j].update.call(model);
        if (model.activeSkills[j].getY.call(model) < 0) {
          model.activeSkills.splice(j, 1);
        }
      }
      requestAnimationFrame(canvasLoop.bind(null, updateTime));
    },
  };

  controller.initialize();
});