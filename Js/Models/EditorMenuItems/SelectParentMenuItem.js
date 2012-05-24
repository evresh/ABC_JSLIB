var SelectParentMenuItem = EditorMenuItem.extend({
    _targetChanged: function() {
        var target = this.get('target');
        this.set('isVisible', target && target[0].tagName.toLowerCase() != 'body'
            && target.parent()[0].tagName.toLowerCase() != 'body');
    }
})