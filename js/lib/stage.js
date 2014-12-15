/* global define */
/**
 * Event Stage
 * @param  {jQuery Node} stageObject  jQuery Node Represenation of the stage
 */

define(['jquery'], function ($) {
    'use strict';

    var Stage = function (stageObject) {
        this.list = {};
        this.stage = stageObject;
        this.background = $('<div class="background"></div>');
        $('body').append(this.background);
    };

    Stage.prototype = {
        /**
         * Adds a event to the stage
         * @param {String}  eventId                 ID of the event
         * @param {Object}  Eventobject
         * @param {String}  Eventobject.id          ID of event
         * @param {Array}   Eventobject.timers      Occurence of the event
         * @param {Object}  Eventobject.container   DOM Node of event     
         */
        add: function (eventId, event) {
            this.list[eventId] = event;
        },

        /**
         * Initializes the stage with its event nodes
         * @param  {Array}      eventQueue      Queue with events
         * @param  {Function}   eventAction     Callback for stage
         */
        init: function (eventQueue, eventAction) {
            var self = this;

            eventQueue.forEach(function (event, index) {
                var $eventDom = $(self.list[event.event].container);
                eventAction(event, $eventDom);

                self.stage.append($eventDom);
            });
        },

        find: function (eventId) {
            var stageItems = this.stage.find('[data-id="' + eventId + '"]'),
                results = [];

            stageItems.each(function (i, item) {
                results.push($(item).index());
            });

            return results.sort();
        },

        off: function (index) {
            this.stage.find('li').eq(index).remove();
        },

        on: function (index) {
            var self = this;
            this.stage.find('.staged').removeClass('staged');

            var event = this.stage.find('li').eq(index);

            event.addClass('staged');

            if (event.data('id') !== undefined) {
                window.location.hash = event.data('id');
            }

            $('html').addClass('unstaging').delay(500).queue(function (next) {
                var currentImg = self.background.find('.event-image'),
                    nextImg = event.find('.event-image').clone();

                if (currentImg.length === 0) {
                    self.background.append(nextImg);
                } else {
                    currentImg.replaceWith(nextImg[0]);
                }

                $(this).removeClass('unstaging');
                next();
            });
        }
    };

    return Stage;
});
