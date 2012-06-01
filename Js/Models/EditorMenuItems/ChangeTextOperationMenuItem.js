var ChangeTextOperationMenuItem = OperationMenuItem.extend({
    defaults: function() {
        return $.extend({}, OperationMenuItem.prototype.defaults, {
            type: 'changeText'
        });
    },
    update: function() {
        var target = this.get('target');
        var tagName = target.get(0).tagName;
        this.set('isVisible', !!target && target.children().length == 0 && tagName != 'IMG' && tagName != 'INPUT');
    }
})