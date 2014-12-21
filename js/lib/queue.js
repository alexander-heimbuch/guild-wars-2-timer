/*global define*/
/**
 * Event Queue
 * Creates, stores and updates the timedependend list of events
 */
define(function () {
    'use strict';

    var Queue = function (onStart, onUpdate) {
        this.q = [];
        this.updateInterval = 1000;
        this.currentEvent = 0;
        this.upcomingEvent = 1;

        this.updateTimer = undefined;

        this.onStart = function () {};
        if (onStart !== undefined) {
            this.onStart = onStart;
        }

        this.onUpdate = function () {};
        if (onUpdate !== undefined) {
            this.onUpdate = onUpdate;
        }
    };

    Queue.prototype = {

        /**
         * Adds a new event to the queue
         * @param {String}  eventId                 Id of the event
         * @param {Object}  Eventobject
         * @param {String}  Eventobject.id          ID of event
         * @param {Array}   Eventobject.timers      Occurence of the event
         * @param {Object}  Eventobject.container   DOM Node of event          
         */
        add: function (eventId, event) {
            var self = this;

            $.each(event.timers, function (index, time) {
                var eventTime = self.terminate(time);

                if (eventTime !== undefined) {
                    self.q.push({
                        event: eventId,
                        end: eventTime.end,
                        start: eventTime.start
                    });
                }
            });
        },

        terminate: function (time) {

            var now = new Date(),
                // 
                coeff = 1000 * 60 * 5,
    
                eventTime = {
                    start: 0,
                    end: 0
                },

                hours = parseInt(time.split(':').shift()),
                minutes = parseInt(time.split(':').pop()),

                startTime = new Date();
                startTime.setUTCHours(hours);
                startTime.setUTCMinutes(minutes);

            eventTime.end = startTime.getTime() - now.getTime();
            eventTime.start = Math.round(startTime / coeff) * coeff;

            // In case the event start was not within the last 15 minutes don't put bring it in the queue
            if (eventTime.end >= (-1 * 15 * 60 * 1000)) {
                return eventTime;
            }

            return undefined;
        },

        /**
         * Removes a event with a specific index from the Queue
         * @param  {Integer} Index in queue
         */
        remove: function (index) {
            this.q.splice(index, 1);
        },

        /**
         * Starts the queue timer
         */
        start: function () {
            // Calls the initial callback function
            this.onStart(this.upcomingEvent, this.q[this.upcomingEvent]);

            var self = this;
            this.updateTimer = setInterval(
                function () {
                    self.update();
                },
                this.updateInterval
            );
        },

        /**
         * Stops the queue timer
         */
        stop: function() {
            clearInterval(this.updateTimer);
        },

        /**
         * Search for events in the queue
         * @param  {String} eventId
         * @return {Array}  Array with eventobjects
         */
        find: function (eventId) {
            var results = [];

            this.q.forEach(function (event, index) {
                if (event.event === eventId) {
                    event.index = index;
                    results.push(event);
                }
            });

            return results;
        },

        /**
         * Sorts the queue for time left until end, triggers update once to clean the queue
         */
        sort: function() {
            this.q.sort(function(a, b) {
                return a.end - b.end;
            });

            this.update();
        },

        /**
         * Updates the queue with current time, called every second
         */
        update: function () {
            var self = this;
            // Iterate over every event
            this.q.forEach(function (event, index) {
                var now = new Date().getTime(),
                    eventIndex = index;

                // Prevent index overflow
                if (eventIndex < (self.q.length - 1)) {
                    ++eventIndex;
                }

                // If the current event is over, it will be removed from the queue
                if (self.q[eventIndex].start - now <= 0) {
                    self.upcomingEvent -= 1;

                    if (self.upcomingEvent < 1) {
                        self.upcomingEvent = 1;
                    }

                    self.remove(self.currentEvent);
                    // Trigger the update callback if a event is removed from the queue
                    self.onUpdate(self.currentEvent, self.upcomingEvent, self.q[self.upcomingEvent]);
                }
            });
        }
    };

    return Queue;
});
