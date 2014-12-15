/* globals Kinetic */
/*!
 * jQuery Final Countdown
 *
 * @author Pragmatic Mates, http://pragmaticmates.com
 * @author Alexander Heimbuch, http://zusatzstoff.org
 * 
 * @version 1.1.1
 * @license GPL 2
 * @link https://github.com/PragmaticMates/jquery-final-countdown
 */
define(['jquery', 'kinetic'], function ($, Kinetic) {

    'use strict';

    function FinalCountdown (selector, options, callback) {
        this.timer = undefined;
        this.interval = undefined;

        this.circleSeconds = undefined;
        this.circleMinutes = undefined;
        this.circleHours = undefined;
        this.circleDays = undefined;

        this.layerSeconds = undefined;
        this.layerMinutes = undefined;
        this.layerHours = undefined;
        this.layerDays = undefined;

        this.daysWidth = undefined;
        this.hoursWidth = undefined;
        this.minutesWidth = undefined;
        this.secondsWidth = undefined;

        this.callbackFunction = undefined;
        this.element = $(selector);     

        var defaults = $.extend({
            start: undefined,
            end: undefined,
            now: undefined,
            centerLabels: false,
            selectors: {
                value_seconds: '.clock-seconds .val',
                canvas_seconds: '.canvas-seconds',
                label_seconds: '.clock-seconds .text',
                value_minutes: '.clock-minutes .val',
                canvas_minutes: '.canvas-minutes',
                label_minutes: '.clock-minutes .text',
                value_hours: '.clock-hours .val',
                canvas_hours: '.canvas-hours',
                label_hours: '.clock-hours .text',
                value_days: '.clock-days .val',
                canvas_days: '.canvas-days',
                label_days: '.clock-days .text'
            },
            seconds: {
                borderColor: '#7995D5',
                borderWidth: '6'
            },
            minutes: {
                borderColor: '#ACC742',
                borderWidth: '6'
            },
            hours: {
                borderColor: '#ECEFCB',
                borderWidth: '6'
            },
            days: {
                borderColor: '#ECEFCB',
                borderWidth: '6'
            }
        }, options);

        this.settings = $.extend({}, defaults, options);

        if (this.settings.start === undefined) {
            this.settings.start = this.element.data('start');
        }

        if (this.settings.end === undefined) {
            this.settings.end = this.element.data('end');
        }

        if (this.settings.now === undefined) {
            this.settings.now = this.element.data('now');
        }

        if (this.element.data('border-color')) {
            this.settings.seconds.borderColor = this.settings.minutes.borderColor = this.settings.hours.borderColor = this.settings.days.borderColor = this.element.data('border-color');
        }

        if (this.settings.now < this.settings.start ) {
            this.settings.start = this.settings.now;
            this.settings.end = this.settings.now;
        }

        if (this.settings.now > this.settings.end) {
            this.settings.start = this.settings.now;
            this.settings.end = this.settings.now;
        }

        if (typeof callback === 'function') { // make sure the callback is a function
            this.callbackFunction = callback;
        }
        
        // Bind events to window for responsive scaling
        this.scale();
        
        if (this.settings.start !== undefined && this.settings.end !== undefined && this.settings.now !== undefined) {
            this.set(this.settings.start, this.settings.end, this.settings.now);
            this.prepare();
            this.start();
        }

        if (this.settings.centerLabels) {
            this.centerLabels();
        }
    }

    FinalCountdown.prototype = {

        set : function (startTime, endTime, currentTime) {
            this.timer = {
                total: Math.floor((endTime - startTime) / 86400),
                hours: 24 - Math.floor(((endTime - currentTime) % 86400) / 3600),
                minutes: 60 - Math.floor((((endTime - currentTime) % 86400) % 3600) / 60),
                seconds: 60 - Math.floor((((endTime - currentTime) % 86400) % 3600) % 60 )
            };
            this.prepare();
        },

        update : function () {
            if (this.layerSeconds !== undefined) {
                this.layerSeconds.draw();
            }
            
            if (this.layerMinutes !== undefined) {
                this.layerMinutes.draw();
            }

            if (this.layerMinutes !== undefined) {
                this.layerHours.draw();
            }
        },

        scale : function () {
            $(window).load(this.update);

            $(window).on('redraw', function () {
                this.update();
            });

            $(window).on('resize', this.update);
        },

        centerLabels : function () {

            var self = this,
                labels = [{
                    canvas: this.settings.selectors.canvas_seconds,
                    label: this.settings.selectors.label_seconds
                }, {
                    canvas: this.settings.selectors.canvas_minutes,
                    label: this.settings.selectors.label_minutes
                },{
                    canvas: this.settings.selectors.canvas_hours,
                    label: this.settings.selectors.label_hours
                },{
                    canvas: this.settings.selectors.canvas_days,
                    label: this.settings.selectors.label_days
                }];

            $.each(labels, function (index, label) {
                var $label = self.element.find(label.label),
                    canvasWidth = self.element.find(label.canvas).width();
                $label.css({
                    top: (canvasWidth / 2) - ($label.height() / 2) + 'px',
                    left: (canvasWidth / 2) - ($label.width() / 2) + 'px'
                });
            });


        },

        prepare : function () {
            // Seconds
            this.prepareSeconds();
            // Minutes
            this.prepareMinutes();
            // Hours
            this.prepareHours();
            // Days
            this.prepareDays();
        },

        prepareSeconds : function () {
            if (this.element.find(this.settings.selectors.canvas_seconds).length === 0) {
                this.layerSeconds = { draw: function () {} };
                return;
            }

            this.secondsWidth = this.secondsWidth || this.element.find(this.settings.selectors.canvas_seconds).width();

            var self = this,
                secondsStage = new Kinetic.Stage({
                    container: self.element.find(self.settings.selectors.canvas_seconds).get(0),
                    width: self.secondsWidth,
                    height: self.secondsWidth
                });

            this.circleSeconds = new Kinetic.Shape({
                drawFunc: function (context) {
                    var radius = self.secondsWidth / 2 - self.settings.seconds.borderWidth / 2,
                    x = self.secondsWidth / 2,
                    y = self.secondsWidth / 2;

                    context.beginPath();
                    context.arc(x, y, radius, convertToDeg(0), convertToDeg(self.timer.seconds * 6));
                    context.fillStrokeShape(this);

                    self.element.find(self.settings.selectors.value_seconds).html(60 - self.timer.seconds);
                },
                stroke: self.settings.seconds.borderColor,
                strokeWidth: self.settings.seconds.borderWidth
            });

            this.layerSeconds = new Kinetic.Layer();
            this.layerSeconds.add(this.circleSeconds);
            secondsStage.add(this.layerSeconds);            
        },

        prepareMinutes : function () {
            if (this.element.find(this.settings.selectors.canvas_minutes).length === 0) {
                this.layerMinutes = { draw: function () {} };
                return;
            }

            this.minutesWidth = this.minutesWidth || this.element.find(this.settings.selectors.canvas_minutes).width();

            var self = this,
                minutesStage = new Kinetic.Stage({
                    container: self.element.find(self.settings.selectors.canvas_minutes).get(0),
                    width: self.minutesWidth,
                    height: self.minutesWidth
                });

            this.circleMinutes = new Kinetic.Shape({
                drawFunc: function (context) {
                    var radius = self.minutesWidth / 2 - self.settings.minutes.borderWidth / 2,
                    x = self.minutesWidth / 2,
                    y = self.minutesWidth / 2;

                    context.beginPath();
                    context.arc(x, y, radius, convertToDeg(0), convertToDeg(self.timer.minutes * 6));
                    context.fillStrokeShape(this);

                    self.element.find(self.settings.selectors.value_minutes).html(60 - self.timer.minutes);

                },
                stroke: self.settings.minutes.borderColor,
                strokeWidth: self.settings.minutes.borderWidth
            });

            this.layerMinutes = new Kinetic.Layer();
            this.layerMinutes.add(this.circleMinutes);
                minutesStage.add(this.layerMinutes);
        },

        prepareHours : function () {
            if (this.element.find(this.settings.selectors.canvas_hours).length === 0) {
                this.layerHours = { draw: function () {} };
                return;
            }

            this.hoursWidth = this.hoursWidth || this.element.find(this.settings.selectors.canvas_hours).width();

            var self = this,
                hoursStage = new Kinetic.Stage({
                    container: self.element.find(self.settings.selectors.canvas_hours).get(0),
                    width: self.hoursWidth,
                    height: self.hoursWidth
                });

            this.circleHours = new Kinetic.Shape({
                drawFunc: function(context) {
                    var radius = self.hoursWidth / 2 - self.settings.hours.borderWidth/2,
                    x = self.hoursWidth / 2,
                    y = self.hoursWidth / 2;

                    context.beginPath();
                    context.arc(x, y, radius, convertToDeg(0), convertToDeg(self.timer.hours * 360 / 24));
                    context.fillStrokeShape(this);

                    self.element.find(self.settings.selectors.value_hours).html(24 - self.timer.hours);
                },
                stroke: self.settings.hours.borderColor,
                strokeWidth: self.settings.hours.borderWidth
            });

            this.layerHours = new Kinetic.Layer();
            this.layerHours.add(this.circleHours);
            hoursStage.add(this.layerHours);
        },

        prepareDays : function () {
            if (this.element.find(this.settings.selectors.canvas_days).length === 0) {
                this.layerDays = { draw: function() {} };
                return;
            }

            this.daysWidth = this.daysWidth || this.element.find(this.settings.selectors.canvas_days).width();

            var self = this,
                daysStage = new Kinetic.Stage({
                    container: self.element.find(self.settings.selectors.canvas_days).get(0),
                    width: self.daysWidth,
                    height: self.daysWidth
                });

            this.circleDays = new Kinetic.Shape({
                drawFunc: function(context) {
                    var radius = self.daysWidth / 2 - self.settings.days.borderWidth/2,
                    x = self.daysWidth / 2,
                    y = self.daysWidth / 2;

                    context.beginPath();

                    context.arc(x, y, radius, convertToDeg(0), convertToDeg(self.timer.days * 360 / 24));
                    context.fillStrokeShape(this);

                    self.element.find(self.settings.selectors.value_Days).html(24 - self.timer.days);
                },
                stroke: self.settings.days.borderColor,
                strokeWidth: self.settings.days.borderWidth
            });

            this.layerDays = new Kinetic.Layer();
            this.layerDays.add(this.circleDays);
            daysStage.add(this.layerDays);
        },

        start : function () {
            var self = this;

            if (this.interval !== undefined) {
                return false;
            }

            this.interval = setInterval( function() {                        
                if (self.timer.seconds > 59 ) {

                    if (60 - self.timer.minutes === 0 && 24 - self.timer.hours === 0 && self.timer.days === 0) {
                        clearInterval(self.interval);
                        if (self.callbackFunction !== undefined) {
                            self.callbackFunction.call(this); // brings the scope to the callback
                        }
                        return;
                    }

                    self.timer.seconds = 1;

                    if (self.timer.minutes > 59) {
                        self.timer.minutes = 1;
                        self.layerMinutes.draw();

                        if (self.timer.hours > 23) {
                            self.timer.hours = 1;

                            if (self.timer.days > 0) {
                                self.timer.days--;
                                self.layerDays.draw();
                            }
                        } else {                        
                            self.timer.hours++;
                        }     

                        self.layerHours.draw();

                    } else {
                        self.timer.minutes++;
                    }

                    self.layerMinutes.draw();

                } else {            
                    self.timer.seconds++;
                }

                self.layerSeconds.draw();
            }, 1000);
        },

        stop : function () {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    };
    
    function convertToDeg(degree) {
        return (Math.PI/180)*degree - (Math.PI/180)*90;
    }

    return function(timerContainer ,options, callback) {
        return new FinalCountdown(timerContainer, options, callback);
    };
});
