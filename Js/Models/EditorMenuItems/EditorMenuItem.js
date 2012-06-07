var EditorMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        targetElement: null,
        isVisible: false
    },
    update: function() { },
    perform: function() {
        this.trigger('perform', this);
    }
})