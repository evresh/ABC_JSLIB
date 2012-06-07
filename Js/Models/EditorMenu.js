var EditorMenu = Backbone.Model.extend({
    defaults: {
        target: null,
        performedItem: null,
        isVisible: false
    },
    initialize: function() {
        this.set('items', new Backbone.Collection([
            new SelectParentMenuItem({ name: 'Select Parent' })
            ,new OperationMenuItem({ name: 'Edit HTML', type: 'editHTML' })
            ,new OperationMenuItem({ name: 'Edit', type: 'edit' })
            ,new OperationMenuItem({ name: 'Remove', type: 'remove' })
            ,new VisibilityOperationMenuItem()
            ,new OperationMenuItem({ name: 'Change CSS', type: 'changeCSS' })
            ,new ChangeTextOperationMenuItem({ name: 'Change Text' })
            ,new OperationMenuItem({ name: 'Change Image', type: 'changeImage' })
            ,new OperationMenuItem({ name: 'Edit Image', type: 'editImage' })
            ,new OperationMenuItem({ name: 'Change Background Image', type: 'changeBackgroundImage' })
            ,new OperationMenuItem({ name: 'Edit Background Image', type: 'editBackgroundImage' })
            ,new OperationMenuItem({ name: 'Rearrange', type: 'rearrange' })
            ,new OperationMenuItem({ name: 'Move', type: 'move' })
            ,new OperationMenuItem({ name: 'Resize', type: 'resize' })
            //,new OperationMenuItem({ name: 'Change URL', type: EditorOperation })
            //,new OperationMenuItem({ name: 'Track Clicks', type: EditorOperation })
            //,new OperationMenuItem({ name: 'Track Form Submits', type: EditorOperation })
        ]));

        this.on('change:target', this._updateItems, this);
        this.on('change:isVisible', this._visibilityChanged, this);
        this.get('items').on('perform', this._itemPerformed, this);
    },
    _visibilityChanged: function() {
        if (this.get('isVisible'))
            this.unset('performedItem');
        else
            this.unset('target');
    },
    _itemPerformed: function(item) {
        this.set('performedItem', item);
        this.set('isVisible', false);
    },
    _updateItems: function() {
        var target = this.get('target');
        if (target) {
            this.get('items').each(function(item) {
                item.set('targetElement', target.get('element'));
                item.update();
            });
        }
    }
})