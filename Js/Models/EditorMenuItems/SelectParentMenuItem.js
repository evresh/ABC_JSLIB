var SelectParentMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        target: null,
        isVisible: false
    },
    update: function(target) {
        this.set('target', target);
        this.set('isVisible', target && target[0].tagName.toLowerCase() != 'body'
            && target.parent()[0].tagName.toLowerCase() != 'body');
    },
    complete: function() {
        this.trigger('complete', this, this.get('target').parent());
    }
})