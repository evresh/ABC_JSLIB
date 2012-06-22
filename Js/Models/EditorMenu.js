var EditorMenu = Backbone.Model.extend({
    defaults: {
        target: null,
        performedItem: null,
        isVisible: false
    },
    initialize: function() {
        this.set('items', new Backbone.Collection([
            new EditorMenuItem({ name: 'Select Parent', type: 'selectParent' })
            ,new EditorMenuItem({ name: 'Edit HTML', type: 'editHTML' })
            ,new EditorMenuItem({ name: 'Edit', type: 'edit' })
            ,new EditorMenuItem({ name: 'Remove', type: 'remove' })
            ,new EditorMenuItem({ type: 'visibility' })
            ,new EditorMenuItem({ name: 'Change CSS', type: 'changeCSS' })
            ,new EditorMenuItem({ name: 'Change Text', type: 'changeText' })
            ,new EditorMenuItem({ name: 'Change Image', type: 'changeImage' })
            ,new EditorMenuItem({ name: 'Edit Image', type: 'editImage' })
            ,new EditorMenuItem({ name: 'Change Background Image', type: 'changeBackgroundImage' })
            /*,new EditorMenuItem({ name: 'Edit Background Image', type: 'editBackgroundImage' })
            ,new EditorMenuItem({ name: 'Rearrange', type: 'rearrange' })*/
            ,new EditorMenuItem({ name: 'Move', type: 'move' })
            ,new EditorMenuItem({ name: 'Resize', type: 'resize' })
            //,new EditorMenuItem({ name: 'Change URL', type: EditorOperation })
            //,new EditorMenuItem({ name: 'Track Clicks', type: EditorOperation })
            //,new EditorMenuItem({ name: 'Track Form Submits', type: EditorOperation })
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