

var $plans       = $('.plans'),
    $newplan     = $('.new'),
    $swipe_right = $('.swipe-right'),
    $swipe_left  = $('.swipe-left'),
    $taphold     = $('.tap-and-hold');

Hammer($swipe_right[0]).on('release dragright', function(e) {
    e.gesture.preventDefault();

    if(e.type == 'dragright') {
        $swipe_right.removeClass('animate');

        $swipe_right.css("transform", "translate3d("+ e.gesture.deltaX +"px,0,0)");
    }

    if(e.type == 'release') {
        $swipe_right.removeClass('animate');

        $swipe_right.addClass('animate');
        $swipe_right.css("transform", "translate3d(0,0,0)");
    }
})

Hammer($swipe_left[0]).on('release dragleft', function(e) {
    e.gesture.preventDefault();

    if(e.type == 'dragleft') {
        $swipe_left.removeClass('animate');

        $swipe_left.css("transform", "translate3d("+ e.gesture.deltaX +"px,0,0)");
    }

    if(e.type == 'release') {
        $swipe_left.removeClass('animate');

        $swipe_left.addClass('animate');
        $swipe_left.css("transform", "translate3d(0,0,0)");
    }
})

var holding = false;

Hammer($taphold[0]).on('release touch drag', function(e) {
    e.gesture.preventDefault();

    if(e.type == 'touch') {
        $taphold.removeClass('animate');
        $taphold.css({'position':'relative', 'z-index':10});
        holding = true;
    }

    if(e.type == 'drag') {
        if(holding) {
            $taphold.css("transform", "translate3d(0,"+ e.gesture.deltaY +"px,0)");
        }
    }

    if(e.type == 'release') {
        $taphold.removeClass('animate');
        $taphold.addClass('animate');

        $taphold.css("transform", "translate3d(0,0,0)");
    }
})

var stepheight      = $('.step').first().outerHeight(),
    touch_upper     = null,
    touch_lower     = null,
    touchDelta      = 0,
    deltaStart      = 0,
    $step_break     = null;

Hammer($plans[0]).on('release touch drag pinch', function(e) {
    e.gesture.preventDefault();

    if(e.type == 'drag') {
        $plans.removeClass('animate');
        $newplan.removeClass('animate');

        var deltaY = (e.gesture.deltaY < 0) ? 0 : (e.gesture.deltaY / 2);
            deltaY = deltaY > 90 ? 90 : deltaY;

        var toRadian = Math.PI / 180;
        var angleInRadians = deltaY * toRadian;

        $newplan.css("transform", "perspective(500) rotateX("+ (90 - deltaY) +"deg)");
        $plans.css("transform", "translate3d(0,"+ ((50 * Math.sin(angleInRadians)) - stepheight) +"px,0)");
    }

    if(e.type == 'pinch') {

        var drag_upper = 0,
            drag_lower = 0;

        // on first pinch, calculate starting positions and the step at which we'll be breaking the list
        if( !$step_break ) {
            if( e.gesture.touches[1].clientY < e.gesture.touches[0].clientY ) {
                touch_upper = e.gesture.touches[1].clientY;
                touch_lower = e.gesture.touches[0].clientY;
            } else {
                touch_upper = e.gesture.touches[0].clientY;
                touch_lower = e.gesture.touches[1].clientY;
            }

            deltaStart = (touch_lower - touch_upper);
            var midpoint = touch_upper + (deltaStart / 2);

            $('.step').each(function() {
                if( $(this).offset().top < midpoint )
                    $step_break = $(this);
            });
        }

        $step_break.removeClass('animate');
        $('.step').removeClass('animate');

        if( e.gesture.touches[1].clientY < e.gesture.touches[0].clientY ) {
            drag_upper = e.gesture.touches[1].clientY;
            drag_lower = e.gesture.touches[0].clientY;
        } else {
            drag_upper = e.gesture.touches[0].clientY;
            drag_lower = e.gesture.touches[1].clientY;
        }

        if(e.gesture.touches.length > 1) {
            var deltaUpper = (touch_upper - drag_upper),
                deltaLower = (drag_lower - touch_lower),
                dragDelta  = (drag_lower - drag_upper - deltaStart);

            var toRadian = Math.PI / 180;
            var angleInRadians = deltaY * toRadian;

            if( (drag_lower - drag_upper) > deltaStart ) {
                $step_break.prevUntil('.step:first-child').css("transform", "translate3d(0,"+ -(50 * Math.sin(deltaUpper * toRadian)) +"px,0)");
                $step_break.css("margin-top", (50 * Math.sin(deltaLower * toRadian)) +"px");

                // the folding step;
                var $folding_step = $('.folding-step');

                if( dragDelta < 90 ) {
                    $folding_step.css({ 'display' : 'block', 'top' : $step_break.prev().offset().top + stepheight });
                    $folding_step.find('.part-top')
                        .css("transform", "perspective(500px) rotate3d(1,0,0,"+ (-90 + dragDelta) +"deg)")
                        .css('background', '-webkit-linear-gradient(top, hsl(210, 14%, 41%), hsl(210, 14%, '+ (30 + (dragDelta * ( 10 / 90 ))) +'%))');
                    $folding_step.find('.part-bottom')
                        .css("transform", "perspective(500px) translate3d(0,"+ (50 * Math.sin(dragDelta * toRadian) - 52) +"px,0) rotate3d(1,0,0,"+ (90 - dragDelta) +"deg)")
                        .css('background', '-webkit-linear-gradient(top, hsl(210, 14%, '+ (30 + (dragDelta * ( 10 / 90 ))) +'%), hsl(210, 14%, 41%))');
                }
            }
        }
    }

    if(e.type == 'release') {
        $plans.removeClass('animate');
        $plans.addClass('animate');

        $newplan.removeClass('animate');
        $newplan.addClass('animate');

        $plans.css("transform", "translate3d(0,"+ -stepheight +"px,0)");
        $newplan.css("transform", "perspective(400px) rotate3d(1,0,0,90deg)");

        if( $step_break ) {
            $step_break.removeClass('animate');
            $('.step').removeClass('animate');

            $step_break.addClass('animate');
            $('.step').addClass('animate');

            $step_break.prevUntil('.step:first-child').css("transform", "translate3d(0,0,0)");
            $step_break.css("margin-top", 0);

            $step_break = null;

            $('.folding-step').hide();
        }
    }
})

