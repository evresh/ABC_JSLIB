var TestPage = Backbone.Model.extend({
    defaults: {
        pageUrl: '',
        targetEvent: false
    },
    selectTarget: function(target) {
        this.set('targetEvent', { target: target });
    }
})