var VisibilityOperationMenuItem = OperationMenuItem.extend({
    defaults: function() {
        return $.extend({}, OperationMenuItem.prototype.defaults, {
            type: 'visibility'
        });
    },
    update: function() {
        var targetElement = this.get('targetElement');
        this.set('isVisible', !!targetElement);

        if (targetElement)
            this.set('name', VisibilityOperation.isTargetElementHidden(targetElement) ? 'Show' : 'Hide');
    }
})