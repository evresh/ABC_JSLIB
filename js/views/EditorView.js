var EditorView = Backbone.View.extend({
    events: {
        'click .saveChanges': '_save'
    },
    initialize: function() {
        this._testView = new TestPageView({
            model: this.model.get('testPage'),
            excludeHeightSelector: '.topBar'
        });
    },
    render: function() {
        this._testView.render().$el.appendTo(this.$('.testPage'));

        return this;
    },
    _save: function() {
        this.model.save();
    }
})