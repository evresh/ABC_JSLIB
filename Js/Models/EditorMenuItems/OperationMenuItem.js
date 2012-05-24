var OperationMenuItem = EditorMenuItem.extend({
    _targetChanged: function() {
        this.set('isVisible', !!this.get('target'));
    }
})