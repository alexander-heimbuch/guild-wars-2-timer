define(['jquery' ,'cookie'], function ($, cookie) {

    var resolvedEvents = [],
        cookieName = 'timer';

    if (($.cookie(cookieName + '-creation') !== undefined) && (new Date($.cookie(cookieName + '-creation')).getDate() != new Date().getDate())) {
        $.removeCookie(cookieName);
        $.removeCookie(cookieName + '-creation');
    }

    if ($.cookie(cookieName) !== undefined) {
        resolvedEvents = $.cookie(cookieName).split(',');
    }

    var markResolved = function (event) {
            if ($.cookie(cookieName) !== undefined) {
                resolvedEvents = $.cookie(cookieName).split(',');
            } else {
                $.cookie(cookieName + '-created', new Date().getTime());
            }

            if (resolvedEvents.indexOf(event) === -1) {
                resolvedEvents.push(event);
                $.cookie(cookieName, resolvedEvents.join(','));
            }
        },

        isResolved = function (event) {
            if (resolvedEvents.indexOf(event) === -1) {
                return false;
            }
            return true;
        },

        resetCookie = function () {
            $.removeCookie(cookieName);
            location.reload();
        };

    return {
        markResolved: markResolved,
        isResolved:isResolved,
        reset: resetCookie
    }

});
