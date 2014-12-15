define(['jquery', 'cookieHandler', 'swipe'], function ($, cookie, swipe) {

    window.addEventListener('orientationchange', function () {
        location.reload();
    });

    return function (Stage, Queue, Timer) {
        $('body').swipe({
            swipe: function (event, direction) {

                if ($('#about-overlay').hasClass('visible')) {
                    return false;
                }

                var index;

                switch (direction) {
                    case 'left':
                        index = Queue.upcomingEvent + 1;
                    break;
                    case 'right':
                        index = Queue.upcomingEvent - 1;
                    break;
                    case 'up':
                        index = Queue.upcomingEvent;
                        cookie.markResolved(Queue.q[index].event);
                        Stage.off(index);
                        Queue.remove(index);
                    break;
                    default:
                        return false;
                }

                if ((index > (Queue.q.length - 1)) || (Queue.q[index].start - new Date().getTime() < 0)) {
                    return false;
                }

                Stage.on(index);
                Queue.upcomingEvent = index;
                Timer.set(parseInt(new Date().getTime()/1000), parseInt(Queue.q[index].start/1000), parseInt(new Date().getTime()/1000));
                Timer.update();
            }
        });

        return function (event, $eventDom) {
            var $activity = $eventDom.find('.activity'),
                startTime = new Date(event.start),
                $actions = $('<span class="start-time">' + startTime.getHours() + ':' + (startTime.getMinutes() < 10 ? '0' : '') + startTime.getMinutes() + '</span>');

            $activity.append($actions);
        };
    };
});
