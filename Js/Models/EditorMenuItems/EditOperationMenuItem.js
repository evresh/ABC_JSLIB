var EditOperationMenuItem = OperationMenuItem.extend({
    defaults: function() {
        return $.extend({}, OperationMenuItem.prototype.defaults, {
            type: 'edit'
        });
    },
    update: function() {
        var targetElement = this.get('targetElement');
        this.set('isVisible', !!targetElement && targetElement.get(0).tagName != 'IMG');
    }
})
