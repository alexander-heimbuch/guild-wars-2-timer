/* global require */
// require configuration
require.config({
    baseUrl: './',
    paths: {
        jquery: 'bower_components/jquery/dist/jquery.min',
        cookie: 'bower_components/jquery-cookie/jquery.cookie',
        kinetic: 'bower_components/kineticjs/kinetic.min',
        swipe: 'bower_components/jquery-touchswipe/jquery.touchSwipe.min',
        Queue: 'js/lib/queue',
        Stage: 'js/lib/stage',
        Timer: 'js/lib/timer',
        cookieHandler: 'js/lib/cookie-handler',
        core: 'js/core',
        desktop: 'js/desktop',
        touch: 'js/touch'
    }
});

require(['jquery'], function ($) {
    'use strict';

    // Image preloader
    var $preloader = $('<div class="preloader"><i class="fa fa-refresh fa-spin"></i></div>'),
        applicationStart = new Date();

    $('body').append($preloader);

    // After the full page is loaded get the core and remove the preloader
    $(function () {
        // Load the core
        require(['core'], function () {
            // Everything is loaded now we can remove the preloader
            $preloader.addClass('done').delay(1000).queue(function (next) {
                $(this).remove();
                next();
            });
        });
    });

    // To prevent errors with timings we reload the full application on focus
    $(window).focus(function () {
        if (applicationStart - new Date() <= -1 * 60 * 1000 * 5) {
            location.reload();
        }
    });
});
