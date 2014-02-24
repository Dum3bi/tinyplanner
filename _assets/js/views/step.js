
(function() {

    TinyPlanner.StepItem = TinyMVC.View.extend({

        template: 'step',

        render: function() {
            var s           = this.model,
                startTime   = new Date(s.startTime);

            return _template('step', {
                type: s.type,
                text: s.text,
                duration: s.getDurationInText(),
                starttime: s.type == 'then' ? startTime.getHours() + ':' + (parseInt(startTime.getMinutes()) < 10 ? '0'+startTime.getMinutes() : startTime.getMinutes()) : ''
            });
        }
    });
    
})(this);