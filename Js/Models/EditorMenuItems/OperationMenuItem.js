var OperationMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        type: null,
        subType: '',
        isVisible: false
    },
    update: function(target) {
        var operation = new (this.get('type'))({ target: target, subType: this.get('subType') });
        this.set('operation', operation);
        this.set('isVisible', operation.isAllowed());
    },
    perform: function() {
        this.trigger('perform', this);
    }
})