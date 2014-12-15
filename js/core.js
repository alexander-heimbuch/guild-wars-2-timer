/*global define, require, device*/
/**
 * The Core
 * Initialize Timer, Stage and Queue, registers Guild Wars 2 events and loads device specific javascript
 */
define(['jquery', 'cookieHandler', 'Queue', 'Stage', 'Timer'], function ($, cookie, Q, S, T) {
    'use strict';

    // Control variables
    var deviceInterface,
        eventCount = 0,

        // Reference jquery nodes
        $about = $('#about-overlay'),
        $stage = $('#stage'),

        // Initiate the timer instance
        Timer = new T('#timer', {
            seconds: {
                borderColor: '#c94545',
                borderWidth: '15'
            },
            minutes: {
                borderColor: '#c94545',
                borderWidth: '15'
            },
            hours: {
                borderColor: '#c94545',
                borderWidth: '15'
            },
            centerLabels: true
        }),
        // Initiate the stage manager
        Stage = new S ($stage),
        // Initiate the queue manager with methods that should fire on start of the queue and on update
        Queue = new Q (
            function (index, event) {
                if (event === undefined) {
                    location.reload();
                }

                if (window.location.hash !== '') {
                    var search = Queue.find(window.location.hash.substring(1));
                    if (search.length > 0 && (search[0].start > (new Date().getTime() + (15 * 60 * 1000)))) {
                        event = search[0];
                        index = event.index;
                    }
                }
                Stage.on(index);
                Timer.set(parseInt(new Date().getTime()/1000), parseInt(event.start/1000), parseInt(new Date().getTime()/1000));
                Timer.start();
            },
            function (current, upcoming, event) {
                if (event === undefined) {
                    location.reload();
                }
                Stage.off(current);
                Stage.on(upcoming);
                Timer.set(parseInt(new Date().getTime()/1000), parseInt(event.start/1000), parseInt(new Date().getTime()/1000));
            }
        );

    // Define interactions for the help and about overlay
    $('#help').on('click', function () {
        if ($about.hasClass('visible') === false) {
            $about.addClass('visible');
        } else {
            $about.removeClass('visible');
        }
    });

    $('#reset-counter').on('click', function () {
        cookie.reset();
    });

    // Collect the events from the DOM nodes
    $stage.find('li').each(function (index, event) {
        var data = $(event).data(),
            container = {
                id: data.id,
                container: $(event)[0].outerHTML,
                timers: data.timers
            };

        $(event).remove();

        // Checkback cookie data if the user already did this event
        if (cookie.isResolved(data.id) === false) {
            Queue.add(data.id, container);
            Stage.add(data.id, container);

            eventCount += 1;
        }
    });

    // No event was registered, the user marked every event as resolved so we should reset the cookie (also reloads the application)
    if (eventCount === 0) {
        cookie.reset();
    }

    // Detect the interface
    if (device.desktop()) {
        deviceInterface = 'desktop';
    } else {
        deviceInterface = 'touch';
    }

    // Load the specific javscript for the selected device
    require([deviceInterface], function (device) {
        Queue.sort();
        Stage.init(Queue.q, device(Stage, Queue, Timer));
        Queue.start();
    });
});
