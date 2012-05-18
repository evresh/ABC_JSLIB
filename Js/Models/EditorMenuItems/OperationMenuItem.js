var OperationMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        operationType: null,
        isVisible: false
    },
    update: function(target) {
        this.set('operation', new (this.get('operationType'))({ target: target }));
        this.set('isVisible', this.get('operation') && this.get('operation').isAllowed());
    },
    complete: function() {
        alert('Not implemented yet');
    }
})