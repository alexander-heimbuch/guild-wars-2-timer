/* global require */

require.config({
	baseUrl: 'js',
	paths: {
		jquery: 'vendor/jquery-2.1.0.min',
		Queue: 'lib/queue.min',
		Stage: 'lib/stage.min'
	}
});

require(['jquery', 'Queue'], function($, Q) {

	//var EventQueue = new Q(function(){console.log('on Start')}, function(){console.log('onUpdate')});
	// onStart: 
	// 	Events.initStage(function () {
    // var index = $(this).index();
    // Events.stage(index);
    // eventQueue.activeIndex = index;
    // });
    // Events.unbind(0, 'click');
    // Events.stage(this.upcomingEvent);
    
    // onUpdate:
    // 

});