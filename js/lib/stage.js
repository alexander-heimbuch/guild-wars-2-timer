/* global define */
define(function() {
    'use strict';

    var Stage = function(stageSelector, eventFunc) {
        this.list = {};
        this.stage = $(stageSelector);
        this.eventFunc = eventFunc;
    };

    Stage.prototype = {

        add: function(eventId, event) {
            this.list[eventId] = event;
            // this.terminate(eventId);
        },

        init: function() {
            var self = this;

            eventQueue.q.forEach(function(q) {
                var $eventDom = $(self.list[q.event].container),
                    startTime = new Date(q.start),
                    hours = startTime.getHours(),
                    minutes = startTime.getMinutes(),
                    $markAsFinished = $('<span class="mark-as-finished">&#10003;</span>');

                $eventDom.find('.start-time').html(hours + ':' + (minutes < 10 ? '0' : '') + minutes);

                $markAsFinished.on('click', function() {
                    eventQueue.q.forEach(function(event, index) {
                        if (event.event === q.event) {
                            self.unstage(index);
                            eventQueue.remove(index);
                            if (index === eventQueue.upcomingEvent) {
                                Events.stage(eventQueue.upcomingEvent);
                            }
                        }
                    });
                    // prevent click action
                    return false;
                });

                $eventDom.find('h3').append($markAsFinished);
                $eventDom.on('click', onClick);
                $stage.append($eventDom);
            });
        },

        unstage: function(index) {
            $stage.find('li').eq(index).remove();
            this.unbind(eventQueue.currentEvent, 'click');
        },

        unbind: function(index, event) {
            $stage.find('li').eq(index).unbind(event);
        },

        stage: function(index) {
            $stage.find('.staged').removeClass('staged');
            $stage.find('li').eq(index).addClass('staged');
            timer.set(parseInt(new Date().getTime() / 1000), parseInt(eventQueue.q[index].start / 1000), parseInt(new Date().getTime() / 1000));
            timer.start();
        }
    };


    return Stage;
});