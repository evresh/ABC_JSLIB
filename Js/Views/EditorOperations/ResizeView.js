var ResizeView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Resize');
        this._overlay.setContent($('#resizeOperation').html());
    },
    _reset: function() {
        var textboxAttrs = { type: 'text', size: '5' };

        var _this = this;
        this._views = {};
        $.each({ width: textboxAttrs, height: textboxAttrs }, function(prop, attrs) {
            var view = new InputStyleView({ model: _this.model.getItem(prop), attrs: attrs }).render();
            _this._views[prop] = view;
            view.$el.appendTo(_this.$('.' + prop + 'Field').empty());
        });

        this.model.get('target').on('updated', this._overlay.attachToTarget, this._overlay);
    },
    _overlayClosed: function() {
        OperationView.prototype._overlayClosed.apply(this);
        $.each(this._views, function(prop, view) {
            view.remove();
        });

        this.model.get('target').off('updated', this._overlay.attachToTarget, this._overlay);
    }
})