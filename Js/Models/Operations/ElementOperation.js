var ElementOperation = Backbone.Model.extend({
    defaults: {
        target: null,
        name: ''
    },
    isAllowed: function() {
        return true;
    },
    apply: function(operationData) {

    },
    cancel: function() {

    },
    save: function() {

    }
})