var EditorMenu = Backbone.Model.extend({
    defaults: {
        targetEvent: false
    },
    initialize: function() {
        this.set('items', new Backbone.Collection([
            new SelectParentMenuItem({ name: 'Select Parent' })
            ,new OperationMenuItem({ name: 'Edit HTML', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Edit', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Change CSS', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Change Text', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Change Image', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Edit Image', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Change Background Image', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Edit Background Image', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Rearrange', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Move', operationType: ElementOperation })
            ,new OperationMenuItem({ name: 'Resize', operationType: ElementOperation })
            //,new OperationMenuItem({ name: 'Change URL', operationType: ElementOperation })
            //,new OperationMenuItem({ name: 'Track Clicks', operationType: ElementOperation })
            //,new OperationMenuItem({ name: 'Track Form Submits', operationType: ElementOperation })
        ]));

        this.on('change:targetEvent', this._updateItems, this);
    },
    close: function() {
        this.set('targetEvent', false);
        this.trigger('close');
    },
    _updateItems: function() {
        var targetEvent = this.get('targetEvent');
        if (targetEvent) {
            this.get('items').each(function(item) {
                item.update($(targetEvent.target));
            });
        }
    }
})