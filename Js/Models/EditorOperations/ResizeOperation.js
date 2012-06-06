var ResizeOperation = EditorOperation.extend({
    initialize: function() {
        this.set('items', new Backbone.Collection([
            new StyleItemOperation({ property: 'width', target: this.get('target') }),
            new StyleItemOperation({ property: 'height', target: this.get('target') })
        ]));
        EditorOperation.prototype.initialize.apply(this);
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
    _onEditing: function() {
        if (this.get('isEditing'))
            this.get('items')
                .off('change:changedState', this._onTargetUpdated, this)
                .on('change:changedState', this._onTargetUpdated, this);
    },
    _onTargetUpdated: function() {
        this.trigger('targetUpdated');
    },
    _discardChanges: function() {
        this.get('items').off('change:changedState', this._onTargetUpdated, this);

        this.get('items').each(function(item) {
            item.cancel();
        });

        this._onTargetUpdated();
    },
    _deleteChanges: function() {
        this.get('items').off('change:changedState', this._onTargetUpdated, this);

        this.get('items').each(function(item) {
            item.remove();
        });

        this._onTargetUpdated();
    }
});