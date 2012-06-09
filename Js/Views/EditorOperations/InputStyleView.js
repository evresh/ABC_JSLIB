var InputStyleView = Backbone.View.extend({
    tagName: 'input',
    events: {
        'keyup': '_changed'
    },
    initialize: function() {
        this.model.on('stateResetted', this.render, this);
    },
    render: function() {
        if (!this.$el.parent().length)
            this.$el.attr($.extend({ type: 'text' }, this.options.attrs || {}));

        var value = this.model.getValue();
        var property = this.model.get('property')
        if (property == 'top' || property == 'left') {
            if (value.toLowerCase() == 'auto')
                value = '0px';
            else if (value.indexOf('px') == -1)
                value += 'px';
        }

        this.$el.val(value);

        return this;
    },
    remove: function() {
        this.$el.remove();
        this.model.off('stateResetted', this.render, this);
    },
    _changed: function() {
        this.model.apply(this.$el.val());
    }
})