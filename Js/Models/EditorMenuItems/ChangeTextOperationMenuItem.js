var ChangeTextOperationMenuItem = OperationMenuItem.extend({
    defaults: function() {
        return $.extend({}, OperationMenuItem.prototype.defaults, {
            type: 'changeText'
        });
    },
    update: function() {
        var targetElement = this.get('targetElement');
        var tagName = targetElement.get(0).tagName;
        this.set('isVisible', !!targetElement && targetElement.children().length == 0 && tagName != 'IMG' && tagName != 'INPUT');
    }
})