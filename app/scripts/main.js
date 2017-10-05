window.requestAnimFrame = (function setRequestAnimFrame() {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function requestAnimFrame(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}());

(function makeModel() {
  function getViewDimensions() {
    return { x: $(window).width(), y: $(window).height() };
  }

  function getViewAspect() {
    return getViewDimensions().x / getViewDimensions().y;
  }

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  function getCanvasDimensions() {
    return { x: canvas.width, y: canvas.height };
  }

  function getCanvasAspect() {
    return canvas.width / canvas.height;
  }

  function setCanvasDimensions(x, y) {
    if (x) canvas.width = getViewDimensions().x;
    if (y) canvas.height = getViewDimensions().y;
  }

  function isShortLandscape() {
    return getViewAspect() >= 4 / 3 && getViewAspect() < 16 / 9;
  }

  function isLongLandscape() {
    return getViewAspect() >= 16 / 9;
  }

  function isShortPortrait() {
    return getViewAspect() <= 3 / 4 && getViewAspect() > 9 / 16;
  }

  function isLongPortrait() {
    return getViewAspect() <= 9 / 16;
  }

  function isSquarish() {
    return getViewAspect() < 4 / 3 && getViewAspect() > 3 / 4;
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  const skillList = [
    'ES2015', 'CSS3', 'HTML5', 'Gulp', 'MVC', 'JavaScript', 'Foundation', 'Bootstrap',
    'Node.js', 'npm', 'postcss', 'bash', 'git', 'gitHub', 'Photoshop', 'DRY code',
    'clean code', 'self-documenting code', 'mobile-first', 'responsive design',
    'functional programming', 'OOP', 'hella APIs', 'Atom', 'Visual Studio Code',
    'jQuery', 'Flexbox', 'babel', 'sourcemaps', 'compatability', 'graphic design',
  ];
  const skillColors = ['hsl(290, 6%, 18%)', '#fbf579'];

  const activeSkills = [];

  const activeFlames = {
    a: [], b: [], c: [], d: [],
  };

  const flameColors = [
    'hsla(47, 94%, 73%, .8)',
    'hsla(47, 94%, 73%, .7)',
    'hsla(47, 94%, 73%, .6)',
    'hsla(47, 94%, 73%, .5)',
  ];

  let drawMethod = 'fill';

  function getDrawMethod() {
    return drawMethod;
  }

  function setDrawMethod(newMethod) {
    drawMethod = newMethod;
  }

  let drawStyle = 'strokeStyle';

  function getDrawStyle() {
    return drawStyle;
  }

  function setDrawStyle(newStyle) {
    drawStyle = newStyle;
  }

  function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
  }

  let skillCounter = 0;

  function skillModule(width, height) {
    skillCounter++;
    const skill = skillList[skillCounter % skillList.length];

    const font = width > height
      ? random((height) * 0.09, (height) * 0.13)
      : random((width) * 0.06, (width) * 0.1);

    context.font = `${font}px Archivo Black`;
    const textWidth = context.measureText(skill).width;

    const x = random(0, canvas.width - textWidth);
    let y = canvas.height + font;
    const velY = random(1, 4);

    const color = skillColors[skillCounter % 2];

    function draw() {
      context.font = `${font}px Archivo Black`;
      context.fillStyle = color;
      context.fillText(skill, x, y);
    }
    function update() {
      y -= velY;
    }
    function getY() {
      return y;
    }

    return {
      draw, update, getY, skill,
    };
  }

  function flameModule() {
    const r = random((canvas.height) * 0.01, (canvas.height) * 0.035);
    const x = random(0, canvas.width);
    let y = canvas.height + (r * 2);
    const velY = random(1, 4);
    const deletePoint = random(canvas.height * 0.7, canvas.height * 0.95);

    function define() {
      context.moveTo(x + r, y);
      context.arc(x, y, r, 0, Math.PI * 2, true);
    }
    function update() {
      y -= velY;
    }
    function getY() {
      return y;
    }

    return {
      define, update, getY, deletePoint,
    };
  }

  function fillFlameArray(arr) {
    while (arr.length < 40) {
      const flame = flameModule();
      arr.push(flame);
    }
  }

  function drawFlames(width, arr, style, color, method) {
    context.lineWidth = width + 3;
    context[style] = color;
    context.beginPath();
    arr.forEach((item) => {
      item.define();
      item.update();
    });
    context[method]();
    context.closePath();
  }

  let end = 0;

  function drawWaves(width, height, orientation) {
    const length = orientation ? width * 2 : width;
    let end2 = (0 - length * 0.08) + end;
    context.fillStyle = '#fbf579';
    context.beginPath();
    while (end2 < width) {
      context.moveTo(end2, height * 0.95);
      context.bezierCurveTo(end2 + length * 0.02, height * 0.9, end2 + length * 0.06, height, end2 + length * 0.08, height * 0.95);
      end2 += length * 0.08
    }
    end = end < 0 ? end + 1 : 0 - length * 0.08
    context.lineTo(end2, height)
    context.lineTo(0, height)
    context.lineTo(0, height * 0.95)
    context.fill();
  }

  window.app = {};
  window.app.model = {
    getViewDimensions,
    getViewAspect,
    context,
    getCanvasDimensions,
    getCanvasAspect,
    setCanvasDimensions,
    isShortLandscape,
    isLongLandscape,
    isShortPortrait,
    isLongPortrait,
    isSquarish,
    isMobile,
    activeSkills,
    activeFlames,
    flameColors,
    getDrawMethod,
    setDrawMethod,
    getDrawStyle,
    setDrawStyle,
    skillModule,
    fillFlameArray,
    drawFlames,
    drawWaves,
  };
}());

(function makeView() {
  function hideProject(current, target, isShortLandscape) {
    if (isShortLandscape) {
      target.children('h3, .project-links').animate({ opacity: 0 }, 300);
    }
    current.addClass('project-collapse');
    setTimeout(() => {
      current.addClass('project-hide');
      if (isShortLandscape) {
        current.css('opacity', 0).animate({ opacity: 1 }, 300);
      }
    }, 400);
  }

  function showProject(current, target, isShortLandscape) {
    target.removeClass('project-hide');
    if (isShortLandscape) {
      target.children('h3, .project-links').css('opacity', 1);
    }
    setTimeout(() => {
      target.removeClass('project-collapse');
    }, 400);
  }

  function revealSecret(parent, element, whenToReveal, scrollTop) {
    const parentTop = parent.offset().top;
    whenToReveal = parentTop + (parent.height() * whenToReveal);

    if (scrollTop > whenToReveal) {
      element.show();
    } else {
      element.hide();
    }
  }

  function hideSecretSection(isMobile) {
    if (isMobile) $('.secret').hide();
  }

  window.app.view = {
    hideProject,
    showProject,
    revealSecret,
    hideSecretSection,
  };
}());

(function makeController(model, view) {
  function setSectionsHeight() {
    $('.hero, .skills').css({ height: model.getViewDimensions().y });
  }

  function toggleProject(e) {
    const current = $('.project-shell:not(.project-hide)');
    const target = $(e.target).closest('.project-hide');
    const animationAlreadyInProgress = $('.project-collapse').length === 4;

    if (animationAlreadyInProgress) {
      return;
    }

    view.hideProject(current, target, model.isShortLandscape());
    setTimeout(() => {
      view.showProject(current, target, model.isShortLandscape());
    }, 400);
  }

  function scrollTo() {
    $.scrollTo('.contact h2', {
      duration: 0,
      onAfter: function onAfter(direction) {
        if (direction !== 'up') {
          setTimeout(() => {
            $('.contact ul li').each((index, item) => {
              setTimeout(() => {
                $(item).addClass('scrollFinish');
              }, (index) * 150);
              setTimeout(() => {
                $(item).removeClass('scrollFinish');
              }, (index + 5) * 150);
            });
          }, 0);
        }
      },
    });
  }

  function revealSecret() {
    const scrollTop = $(window).scrollTop();
    const parent = $('.secret');

    $('.hidden').each((index, item) => {
      view.revealSecret(parent, $(item), index * .055, scrollTop);
    });
  }

  let updateTime = performance.now();

  function canvasLoop() {
    const width = model.getCanvasDimensions().x;
    const height = model.getCanvasDimensions().y;

    model.context.fillStyle = 'rgba(250, 98, 95, 1)';
    model.context.fillRect(0, 0, width, height);

    Object.values(model.activeFlames).forEach((item, index) => {
      model.drawStyle = model.drawStyle === 'strokeStyle' ? 'fillStyle' : 'strokeStyle';
      model.drawMethod = model.drawMethod === 'fill' ? 'stroke' : 'fill';
      model.fillFlameArray(item);
      model.drawFlames(index, item, model.drawStyle, model.flameColors[index], model.drawMethod);
    });

    while (updateTime + 1500 < performance.now()) {
      const skill = model.skillModule(width, height);
      model.activeSkills.push(skill);
      updateTime = performance.now();
    }
    model.activeSkills.forEach((item) => {
      item.draw.call(model);
      item.update.call(model);
    });

    model.drawWaves(width, height, model.isShortPortrait() || model.isLongPortrait());

    requestAnimationFrame(canvasLoop);
  }

  const canvasObjectManagement = setInterval(() => {
    Object.keys(model.activeFlames).forEach((key) => {
      model.activeFlames[key] = model.activeFlames[key]
        .filter(item => !(item.getY() < item.deletePoint));
    });
    model.activeSkills = model.activeSkills.filter(item =>
      !(item.getY() < 0));
  }, 100);

  function setupListeners() {
    $(window)
      .on('resize', model.setCanvasDimensions.bind(null, true, false))
      .on('orientationchange', model.setCanvasDimensions.bind(null, true, true))
      .on('orientationchange', setSectionsHeight)
      .on('scroll', revealSecret);

    $('.projects-grid').on('click', '.project-hide', toggleProject);

    $('.nav-to-contact').on('click', scrollTo);
  }

  function initialize() {
    model.setCanvasDimensions(true, true);
    setupListeners();
    canvasLoop();
    setSectionsHeight();
    view.hideSecretSection(model.isMobile());
  }

  window.app.controller = {
    initialize,
  };
}(window.app.model, window.app.view));

window.app.controller.initialize();

