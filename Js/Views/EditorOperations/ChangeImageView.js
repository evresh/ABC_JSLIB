var ChangeImageView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Change Image');
        this._overlay.setContent($('#changeImageOperation').html());
    },
    _reset: function() {
        this._views = [
            new InputStyleView({ model: this.model.getItem('src'), disableImmediateChange: true }),
            new InputStyleView({ model: this.model.getItem('title') }),
            new InputStyleView({ model: this.model.getItem('alt') }),
            new InputStyleView({ model: this.model.getItem('width'), attrs: { size: '4' } }),
            new InputStyleView({ model: this.model.getItem('height'), attrs: { size: '4' } })
        ];

        var _this = this;
        $.each(this._views, function(i, view) {
            view.render().$el.appendTo(_this.$('.' + view.model.get('property') + 'Field').empty());
        });

        this.model.getItem('src').on('change:changedState', this._srcChanged, this);
        this._srcChanged();
    },
    _overlayClosed: function() {
        OperationView.prototype._overlayClosed.apply(this);
        $.each(this._views, function(i, view) {
            view.remove();
        });

        this.model.getItem('src').on('change:changedState', this._srcChanged, this);
    },
    _srcChanged: function() {
        this.$('.previewContainer img').attr('src', this.model.getItem('src').getValue());
    }
});