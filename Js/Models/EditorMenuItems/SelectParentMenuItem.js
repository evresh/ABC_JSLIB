var SelectParentMenuItem = EditorMenuItem.extend({
    update: function() {
        var targetElement = this.get('targetElement');
        this.set('isVisible', targetElement && targetElement[0].tagName.toLowerCase() != 'body'
            && targetElement.parent()[0].tagName.toLowerCase() != 'body');
    }
})