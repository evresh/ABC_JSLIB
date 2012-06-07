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
            this.$el.attr(this.options.attrs);

        this.$el.val(this.model.getValue());

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