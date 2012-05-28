var EditorMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        target: null,
        isVisible: false
    },
    update: function() { },
    perform: function() {
        this.trigger('perform', this);
    }
})