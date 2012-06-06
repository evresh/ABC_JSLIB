var ResizeView = OperationView.extend({
    _getExtendedEvents: function() {
        return {
            'keyup .resizeWidth': '_widthChanged',
            'keyup .resizeHeight': '_heightChanged'
        }
    },
    _afterRender: function() {
        this._overlay.setTitle('Resize');
    },
    _reset: function() {
        this._overlay.setContent(_.template($('#resizeOperation').html(), {
            width: this.model.getItem('width').getValue(),
            height: this.model.getItem('height').getValue()
        }));
    },
    _widthChanged: function() {
        this.model.getItem('width').apply(this.$('.resizeWidth').val());
    },
    _heightChanged: function() {
        this.model.getItem('height').apply(this.$('.resizeHeight').val());
    }
})