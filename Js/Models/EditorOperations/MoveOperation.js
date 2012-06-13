var MoveOperation = OperationGroup.extend({
    _getInitialItems: function() {
        return new Backbone.Collection([
            new StyleItemOperation({ property: 'left', target: this.get('target') }),
            new StyleItemOperation({ property: 'top', target: this.get('target') }),
            new StyleItemOperation({ property: 'position', target: this.get('target') }),
            new BringToFrontOperation({ property: 'bringToFront', target: this.get('target'), excludePosition: true })
        ]);
    },
    edit: function() {
        var position = this.getItem('position');
        if (position.getValue() == 'static')
            position.apply('relative');

        OperationGroup.prototype.edit.apply(this);

        this.get('target').set('editMode', EditorTargetMode.move);
    }
});