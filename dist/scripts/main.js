'use strict';

$('.projects-grid').on('click', '.project-hidden',  function(e) {
    const visibleProject = $('.project-shell:not(.project-hidden)')
    const headingAndLinks = visibleProject.children('h3, .project-links')
    const textAndBorder = visibleProject.children('p, .project-inner')
    const shell = $(e.target).closest('.project-hidden')

    headingAndLinks.addClass('collapse-cross')


    textAndBorder
        .animate({
            opacity: 0
        }, 300, function () {
            textAndBorder.css('opacity', 1)
            headingAndLinks.removeClass('collapse-cross')
            visibleProject.addClass('project-hidden')
            shell.removeClass('project-hidden')
        })
})