var ChangeImageView = BaseChangeImageView.extend({
    _getSrcModel: function() {
        return this.model.getItem('src');
    },
    _afterRender: function() {
        this._overlay.setTitle('Change Image');
        this._overlay.setContent($('#changeImageOperation').html());
    },
    _showInternal: function() {
        BaseChangeImageView.prototype._showInternal.apply(this);

        this._views = [
            new InputStyleView({ model: this.model.getItem('title') }),
            new InputStyleView({ model: this.model.getItem('alt') }),
            new InputStyleView({ model: this.model.getItem('width') }),
            new InputStyleView({ model: this.model.getItem('height') })
        ];

        var _this = this;
        $.each(this._views, function(i, view) {
            view.render().$el.appendTo(_this.$('.' + view.model.get('property') + 'Field').empty());
        });
    }
});