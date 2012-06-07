var OperationMenuItem = EditorMenuItem.extend({
    update: function() {
        this.set('isVisible', !!this.get('targetElement'));
    }
})