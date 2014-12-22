/*global define*/
/**
 * Interactions for desktop devices
 */
define(['jquery', 'cookieHandler'], function ($, cookie) {
    'use strict';

    window.addEventListener('resize', function () {
        location.reload();
    });
    // Returns the interaction that is executed by the queue
    return function (Stage, Queue, Timer) {
        // This function is executed for every
        return function (event, $eventDom) {
            // Create the mark as finished action dom and registers actions
            var $activity = $eventDom.find('.activity'),
                startTime = new Date(event.start),
                $markAsFinished = $('<i class="fa fa-check mark-as-finished"></i>'),
                $actions = $('<i class="fa fa-eye show"></i><span class="start-time">' + startTime.getHours() + ':' + (startTime.getMinutes() < 10 ? '0' : '') + startTime.getMinutes() + '</span>');

            $activity.append($actions);

            $markAsFinished.on('click', function() {
                Queue.q.forEach( function(event, index) {
                    if (event.event === event.event) {
                        Stage.off(index);
                        Queue.remove(index);
                        cookie.markResolved(event.event);
                        if (index === Queue.upcomingEvent) {
                            Stage.on(Queue.upcomingEvent, Queue.q[Queue.upcomingEvent]);
                        }
                    }
                });
                return false;
            });

            // Append it to the activies for every stage item
            $activity.append($markAsFinished);


            // Stage the event if its dom was clicked
            $eventDom.on('click', function () {
                var index = $(this).index();
                // Only stage events that are not in the past and aren't already staged
                if ((event.start - new Date().getTime() < 0) || $eventDom.hasClass('staged')) {
                    return false;
                }

                Stage.on(index, Queue.q[index]);
                Queue.upcomingEvent = index;
                Timer.set(parseInt(new Date().getTime()/1000), parseInt(event.start/1000), parseInt(new Date().getTime()/1000));
                Timer.update();
            });
        };
    };
});
