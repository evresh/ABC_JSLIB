var ChangeTextView = OperationView.extend({
    maximizable: true,
    events: function() {
        return $.extend({}, OperationView.prototype.events, {
            'keyup textarea': '_textChanged'
        });
    },
    _afterRender: function() {
        this._overlay.setTitle('Change Text');
    },
    _reset: function() {
        this.$('textarea').val(this.model.getValue());
    },
    _textChanged: function() {
        this.model.apply(this.$('textarea').val());
    },
    _toggleMaximizing: function(info) {
        var element = this.$('textarea');
        if (info.maximized) {
            element.attr('actualHeight', element.height()).attr('actualWidth', element.width());
            element.css('height', info.availableHeight - (this.$('.textareaContainer').outerHeight()
                - this.$('textarea').height()));
        } else if (element.attr('actualHeight')) {
            element.css('height', element.attr('actualHeight')).css('width', element.attr('actualWidth'));
        }
        element.toggleClass('maximized', info.maximized);
    }
})