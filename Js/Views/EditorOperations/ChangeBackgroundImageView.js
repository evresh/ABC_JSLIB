var ChangeBackgroundImageView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Change Background Image');
        this._overlay.setContent($('#changeBackgroundImageOperation').html());
    },
    _reset: function() {
        this._inputView = new InputStyleView({ model: this.model, disableImmediateChange: true });
        this._inputView.render().$el.appendTo(this.$('.srcField').empty());

        this.model.on('change:changedState', this._changed, this);
        this._changed();
    },
    _changed: function() {
        var value = this.model.getValue();
        if (value) {
            this.$('.previewContainer img').show().attr('src', value);
        } else {
            this.$('.previewContainer img').hide();
        }
    },
    _overlayClosed: function() {
        OperationView.prototype._overlayClosed.apply(this);
        this._inputView.remove();
        this.model.off('change:changedState', this._changed, this);
    }
})