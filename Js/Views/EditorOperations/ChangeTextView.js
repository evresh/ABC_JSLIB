var ChangeTextView = OperationView.extend({
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
    }
})