var MoveOperation = EditorOperation.extend({
    initialize: function() {
        this.set('items', new Backbone.Collection([
            new StyleItemOperation({ property: 'left', target: this.get('target') }),
            new StyleItemOperation({ property: 'top', target: this.get('target') }),
            new StyleItemOperation({ property: 'position', target: this.get('target') }),
            new BringToFrontOperation({ property: 'bringToFront', target: this.get('target'), excludePosition: true })
        ]));
        EditorOperation.prototype.initialize.apply(this);

        this.on('change:target', this._targetChanged, this);

        var position = this.getItem('position');
        if (position.getValue() == 'static')
            position.apply('relative');
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
        this.get('target').set('editMode', EditorTargetMode.move);
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