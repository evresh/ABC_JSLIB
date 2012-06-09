var BringToFrontOperation = EditorOperation.extend({
    defaults: {
        excludePosition: false
    },
    _zIndex: 2500000,
    initialize: function() {
        var items = new Backbone.Collection([
            new StyleItemOperation({ property: 'z-index', target: this.get('target') })
        ]);
        if (!this.get('excludePosition'))
            items.add(new StyleItemOperation({ property: 'position', target: this.get('target') }));
        this.set('items', items);

        EditorOperation.prototype.initialize.apply(this);

        this.on('change:target', this._targetChanged, this);
    },
    complete: function() {
        this.get('items').each(function(item) {
            item.complete();
        });

        EditorOperation.prototype.complete.apply(this);
    },
    getItem: function(property) {
        return this.get('items').find(function(item) {
            return item.get('property') == property;
        });
    },
    edit: function() {
        EditorOperation.prototype.edit.apply(this);
        this.get('items').each(function(item) {
            item.edit();
        });
    },
    stopEdit: function() {
        EditorOperation.prototype.stopEdit.apply(this);
        this.get('items').each(function(item) {
            item.stopEdit();
        });
    },
    _discardChanges: function() {
        this.get('items').each(function(item) {
            item.cancel();
        });
    },
    _deleteChanges: function() {
        this.get('items').each(function(item) {
            item.remove();
        });
    },
    _targetChanged: function() {
        var target = this.get('target');
        this.get('items').each(function(item) {
            item.set('target', target);
        });
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