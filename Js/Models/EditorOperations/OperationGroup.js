var OperationGroup = EditorOperation.extend({
    initialize: function() {
        this.set('items', this._getInitialItems());
        EditorOperation.prototype.initialize.apply(this);

        this.on('change:target', this._targetChanged, this);
    },
    _getInitialItems: function() {
        return new Backbone.Collection();
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
    }
});