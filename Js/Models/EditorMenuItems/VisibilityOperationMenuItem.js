var VisibilityOperationMenuItem = OperationMenuItem.extend({
    defaults: function() {
        return $.extend({}, OperationMenuItem.prototype.defaults, {
            type: 'visibility'
        });
    },
    update: function() {
        var target = this.get('target');
        this.set('isVisible', !!target);

        if (target)
            this.set('name', VisibilityOperation.isTargetHidden(target) ? 'Show' : 'Hide');
    }
})