var ResizeOperation = EditorOperation.extend({
    initialize: function() {
        this.set('items', new Backbone.Collection([
            new StyleItemOperation({ property: 'width', target: this.get('target') }),
            new StyleItemOperation({ property: 'height', target: this.get('target') })
        ]));
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
    _onEditing: function() {
        var isEditing = this.get('isEditing');
        this.get('items').each(function(item) {
            item.set('isEditing', isEditing);
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