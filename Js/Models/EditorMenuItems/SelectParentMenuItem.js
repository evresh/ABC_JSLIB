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
        if (this.get('isVisible'))
            this.set('parentTarget', this.get('target').parent());
        else
            this.unset('parentTarget');
    },
    perform: function() {
        this.trigger('perform', this);
    }
})