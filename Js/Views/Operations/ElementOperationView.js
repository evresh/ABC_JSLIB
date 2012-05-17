var ElementOperationView = Backbone.View.extend({
    tagName: 'li',
    className: 'elementOperation',
    events: {
        'click': '_performOperation'
    },
    render: function() {
        if (this.model.isAllowed())
            this.$el.html(this.model.get('name'));
        else
            this.remove();

        return this;
    },
    _performOperation: function() {
        alert('Not implemented yet');
    }
});