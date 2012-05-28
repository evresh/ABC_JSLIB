var EditorMenuItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': '_perform'
    },
    initialize: function() {
        this.model.on('change:isVisible', this._visibilityChanged, this);
        this.model.on('change:name', this.render, this);
    },
    render: function() {
        this.$el.html(this.model.get('name'));

        return this;
    },
    _visibilityChanged: function() {
        this.$el.toggle(this.model.get('isVisible'));
    },
    _perform: function(e) {
        this.model.perform();
    }
})