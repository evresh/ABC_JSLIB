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
        this._visibilityChanged();

        return this;
    },
    _visibilityChanged: function() {
        if (this.model.get('isVisible'))
            this.$el.show();
        else
            this.$el.hide();
    },
    _perform: function(e) {
        this.model.perform();
    }
})