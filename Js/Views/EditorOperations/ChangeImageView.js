var ChangeImageView = BaseChangeImageView.extend({
    _getSrcModel: function() {
        return this.model.getItem('src');
    },
    _afterRender: function() {
        this._overlay.setTitle('Change Image');
        this._overlay.setContent($('#changeImageOperation').html());
    },
    _reset: function() {
        BaseChangeImageView.prototype._reset.apply(this);

        this._views = [
            new InputStyleView({ model: this.model.getItem('title') }),
            new InputStyleView({ model: this.model.getItem('alt') }),
            new InputStyleView({ model: this.model.getItem('width'), attrs: { size: '4' } }),
            new InputStyleView({ model: this.model.getItem('height'), attrs: { size: '4' } })
        ];

        var _this = this;
        $.each(this._views, function(i, view) {
            view.render().$el.appendTo(_this.$('.' + view.model.get('property') + 'Field').empty());
        });
    },
    _clear: function() {
        BaseChangeImageView.prototype._clear.apply(this);

        $.each(this._views, function(i, view) {
            view.remove();
        });

        this._views = null;
    }
});