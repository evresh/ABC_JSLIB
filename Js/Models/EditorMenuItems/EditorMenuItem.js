var EditorMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        target: null,
        isVisible: false
    },
    initialize: function() {
        this.on('change:target', this._targetChanged, this);
    },
    _targetChanged: function() { },
    perform: function() {
        this.trigger('perform', this);
    }
})