(function () {

  'use strict';

  var $stage = $('#stage'),
      timer = $('#timer').final_countdown({
        seconds: {
          borderColor: '#fff',
          borderWidth: '15'
        },
        minutes: {
            borderColor: '#fff',
            borderWidth: '15'
        },
        hours: {
            borderColor: '#fff',
            borderWidth: '15'
        },
        centerLabels: true
      }),
      $currentEvent = $('#current-event .event-title'),

      init = function (index, event) {
        var data = $(event).data(),
            container = {
              id : data.id,
              container : $(event)[0].outerHTML,
              timers : data.timers
            };

        $(event).remove();

        Events.add(data.id, container);
      },

      Events = {

        list : {},

        add : function (eventId, event) {
          this.list[eventId] = event;
          this.terminate(eventId);
        },

        activationTime : function (time) {

          // time offset in miliseconds
          var now = new Date(),
              activationTime = new Date(),
              eventTime = {
                start: 0,
                end: 0
              },
          // convert the time in UTC => Times are in CET, add 2 hours
              hours = parseInt(time.split(':').shift()),
              minutes = parseInt(time.split(':').pop());

              activationTime.setHours(hours);
              activationTime.setMinutes(minutes);

              if (hours < activationTime.getHours()) {
                activationTime.setDate(activationTime.getDate()+1);
              }

          var endInMilliSeconds = Date.UTC(activationTime.getUTCFullYear(), activationTime.getUTCMonth(), activationTime.getUTCDate(), activationTime.getUTCHours(), activationTime.getUTCMinutes()) - 
                                  Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()),
              startTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes()) + endInMilliSeconds,
              coeff = 1000 * 60 * 5;
          
          eventTime.start = Math.round(startTime / coeff) * coeff;
          eventTime.end = endInMilliSeconds;

          return eventTime;
        },

        terminate : function (eventId) {
          var self = this;

          this.list[eventId].timers.forEach(function (timer) {
            var eventTime = self.activationTime(timer);

            if (eventTime.end >= (-1 * 15 * 60 * 1000)) {
              eventQueue.add(eventId, eventTime);
            }
          });
        },

        initStage : function (onClick) {
          var self = this;
          
          eventQueue.q.forEach(function (q) {
            var $eventDom = $(self.list[q.event].container),
                startTime = new Date(q.start),
                hours = startTime.getHours(),
                minutes = startTime.getMinutes(),
                $markAsFinished = $('<span class="mark-as-finished">&#10003;</span>');

            $eventDom.find('.start-time').html(hours + ':' + (minutes < 10 ? '0':'') + minutes);

            $markAsFinished.on('click', function () {
              eventQueue.q.forEach(function (event, index) {
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

        unstage : function (index) {
          $stage.find('li').eq(index).remove();
          this.unbind(eventQueue.currentEvent, 'click');
        },

        unbind: function (index, event) {
          $stage.find('li').eq(index).unbind(event);
        },

        stage : function (index) {
          $stage.find('.staged').removeClass('staged');
          $stage.find('li').eq(index).addClass('staged');
          timer.set(parseInt(new Date().getTime()/1000), parseInt(eventQueue.q[index].start/1000), parseInt(new Date().getTime()/1000));
          timer.start();
        }
        
      },

    	eventQueue = {

        q : [],

        updateInterval : 1000,

        currentEvent: 0,
        upcomingEvent: 1,

        add : function (eventId, eventTime) {
          this.q.push({event: eventId, end: eventTime.end, start: eventTime.start});
        },

        remove : function (index) {
          this.q.splice(index, 1);
        },

        start : function () {
          eventQueue.order();
          setInterval(updateQueue, this.updateInterval);
        },

        index : function (eventId) {
          for (var index in this.q) {
            if (this.q[index].id === eventId) {
              return index;
            }
          }

          return undefined;
        },

        order : function () {
          this.q.sort(function(a, b) {return a.end - b.end;});
          updateQueue();
          Events.initStage(function () {
            var index = $(this).index();
            Events.stage(index);
            eventQueue.activeIndex = index;
          });
          Events.unbind(0, 'click');
          Events.stage(this.upcomingEvent);
        }
      },

      updateQueue = function () {
          for (var index in eventQueue.q) {
            var now = new Date().getTime(),
                eventIndex = index;

            if (eventIndex < (eventQueue.q.length -1)) {
              ++eventIndex;
            }

            if (eventQueue.q[eventIndex].start - now <= 0) {

              eventQueue.upcomingEvent -= 1;

              if (eventQueue.upcomingEvent < 1) {
                eventQueue.upcomingEvent = 1;
              }

              eventQueue.remove(eventQueue.currentEvent);
              Events.unstage(eventQueue.currentEvent);
              Events.stage(eventQueue.upcomingEvent);              
            }
          }          
      };

  $stage.find('li').each(init);
  eventQueue.start();
})();
