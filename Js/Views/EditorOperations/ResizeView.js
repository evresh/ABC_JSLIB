var ResizeView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Resize');
        this._overlay.setContent($('#resizeOperation').html());
    },
    _reset: function() {
        this._views = [
            new InputStyleView({ model: this.model.getItem('width'), attrs: { size: '5' } }),
            new InputStyleView({ model: this.model.getItem('height'), attrs: { size: '5' } }),
            new CheckboxStyleView({ model: this.model.getItem('bringToFront'), label: '&nbsp;Bring to Front' })
        ];

        var _this = this;
        $.each(this._views, function(i, view) {
            view.render().$el.appendTo(_this.$('.' + view.model.get('property') + 'Field').empty());
        });

        this.model.get('target').on('updated', this._overlay.attachToTarget, this._overlay);
    },
    _overlayClosed: function() {
        OperationView.prototype._overlayClosed.apply(this);
        $.each(this._views, function(i, view) {
            view.remove();
        });

        this.model.get('target').off('updated', this._overlay.attachToTarget, this._overlay);
    }
})