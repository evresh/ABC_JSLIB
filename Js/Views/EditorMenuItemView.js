var EditorMenuItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': '_performAction'
    },
    initialize: function() {
        this.model.on('change:isVisible', this._visibilityChanged, this);
    },
    render: function() {
        this.$el.html(this.model.get('name'));

        return this;
    },
    _visibilityChanged: function() {
        this.$el.toggle(this.model.get('isVisible'));
    },
    _performAction: function() {
        this.model.complete();
    }
})