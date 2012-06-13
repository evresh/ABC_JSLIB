var BringToFrontOperation = OperationGroup.extend({
    defaults: {
        excludePosition: false
    },
    _zIndex: 2500000,
    _getInitialItems: function() {
        var items = new Backbone.Collection([
            new StyleItemOperation({ property: 'z-index', target: this.get('target') })
        ]);
        if (!this.get('excludePosition'))
            items.add(new StyleItemOperation({ property: 'position', target: this.get('target') }));

        return items;
    },
    apply: function(value) {
        var zIndexOp = this.getItem('z-index');
        var positionOp = this.getItem('position');

        if (value) {
            zIndexOp.apply(this._zIndex);
            if (positionOp && positionOp.getValue() == 'static')
                positionOp.apply('relative');
        } else {
            var zIndexOpInitialState = zIndexOp.get('initialState');
            zIndexOp.apply(zIndexOpInitialState == this._zIndex ? 'auto' : zIndexOpInitialState);
            if (positionOp)
                positionOp.apply(positionOp.get('initialState'));
        }
    },
    getValue: function() {
        var zIndexOp = this.getItem('z-index');

        var value = zIndexOp.get('changedState') || zIndexOp.get('initialState');
        return value == this._zIndex;
    }
})