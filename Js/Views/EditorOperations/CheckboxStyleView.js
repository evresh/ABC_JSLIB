var CheckboxStyleView = Backbone.View.extend({
    tagName: 'span',
    events: {
        'click input': '_changed'
    },
    initialize: function() {
        this.model.on('change:changedState', this.render, this);
    },
    render: function() {
        if (!this.$el.parent().length)
            this.$el.html('<input id="' + this.model.cid + '" type="checkbox" /><label for="' + this.model.cid + '">' + this.options.label + '</label>');

        this.$el.find('input').prop('checked', this.model.getValue());

        return this;
    },
    remove: function() {
        this.$el.remove();
        this.model.off('change:changedState', this.render, this);
    },
    _changed: function() {
        this.model.apply(this.$el.find('input').is(':checked'));
    }
})