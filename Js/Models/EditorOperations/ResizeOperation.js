var ResizeOperation = OperationGroup.extend({
    _getInitialItems: function() {
        return new Backbone.Collection([
            new StyleItemOperation({ property: 'width', target: this.get('target') }),
            new StyleItemOperation({ property: 'height', target: this.get('target') }),
            new BringToFrontOperation({ property: 'bringToFront', target: this.get('target') })
        ]);
    },
    edit: function() {
        OperationGroup.prototype.edit.apply(this);

        this.get('target').set('editMode', EditorTargetMode.resize);
    }
});