var EditorMenu = Backbone.Model.extend({
    defaults: {
        target: null,
        operations: null,
        isRemoved: false
    },
    initialize: function() {
        var target = this.get('target');
        var operations = [
             new ElementOperation({ name: 'Change Image', target: target })
            ,new ElementOperation({ name: 'Edit Image', target: target })
            ,new ElementOperation({ name: 'Change Background Image', target: target })
            ,new ElementOperation({ name: 'Edit Background Image', target: target })
            ,new ElementOperation({ name: 'Change URL', target: target })
            ,new ElementOperation({ name: 'Change Text', target: target })
            ,new ElementOperation({ name: 'Edit', target: target })
            ,new ElementOperation({ name: 'Edit HTML', target: target })
            ,new ElementOperation({ name: 'Rearrange', target: target })
            ,new ElementOperation({ name: 'Move', target: target })
            ,new ElementOperation({ name: 'Resize', target: target })
            ,new ElementOperation({ name: 'Change CSS', target: target })
            ,new ElementOperation({ name: 'Select Parent', target: target })
            //,new ElementOperation({ name: 'Track Clicks', target: target })
            //,new ElementOperation({ name: 'Track Form Submits', target: target })
        ];

        this.set('operations', new Backbone.Collection(_.filter(operations, function(o) { return o.isAllowed(); })));
    }
})