/* global define */

define(function() {
    'use strict';

    var Queue = function (onStart, onUpdate) {
    	this.q = [];
    	this.updateInterval = 1000;
    	this.currentEvent = 0;
    	this.upcomingEvent = 0;

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

    	add: function (eventId, event) {
            this.q.push({
                event: eventId,
                end: eventTime.end,
                start: eventTime.start
            });
        },

        terminate: function (event) {

        },

        remove: function (index) {
            this.q.splice(index, 1);
        },

        start: function () {
            this.order();
            this.onStart();

            var self = this;
            this.updateTimer = setInterval(
            	function () {
            		self.update();
            	},
            	this.updateInterval
            );
        },

        stop: function () {
        	clearInterval(this.updateTimer);
        },

        index: function (eventId) {
            for (var index in this.q) {
                if (this.q[index].id === eventId) {
                    return index;
                }
            }

            return undefined;
        },

        order: function () {
            this.q.sort(function(a, b) {
                return a.end - b.end;
            });
            this.update();
        },

        update: function() {
            for (var index in this.q) {
                var now = new Date().getTime(),
                    eventIndex = index;

                if (eventIndex < (this.q.length - 1)) {
                    ++eventIndex;
                }

                if (this.q[eventIndex].start - now <= 0) {

                    this.upcomingEvent -= 1;

                    if (this.upcomingEvent < 1) {
                        this.upcomingEvent = 1;
                    }

                    this.remove(this.currentEvent);
                    this.onUpdate();
                }
            }
        }
    };

    return Queue;
});