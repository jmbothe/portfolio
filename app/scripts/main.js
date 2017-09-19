'use strict';

$('.projects-grid').on('click', '.project-hide',  function(e) {
    const current = $('.project-shell:not(.project-hide)')
    const target = $(e.target).closest('.project-hide')

    setTimeout(function() {
        current.addClass('project-collapse')
    }, 0)

    setTimeout(function() {
        current.addClass('project-hide')
        target.removeClass('project-hide')
    }, 550)

    setTimeout(function() {
        target.removeClass('project-collapse')
    }, 1100)

})