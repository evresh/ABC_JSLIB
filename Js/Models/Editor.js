var Editor = Backbone.Model.extend({
    defaults: {
        testPage: null,
        menu: null
    },
    initialize: function() {
        this.set('testPage', new TestPage({ pageUrl: this.get('pageUrl') }));
        this.get('testPage').on('change:targetEvent', this._targetChanged, this);

        this.set('menu', new EditorMenu());
        this.get('menu').on('close', this._menuClosed, this);
        this.get('menu').get('items').on('complete', this._menuItemCompleted, this);
    },
    save: function() {
        alert('Not implemented yet');
    },
    _targetChanged: function() {
        var targetEvent = this.get('testPage').get('targetEvent');
        this.get('menu').set('targetEvent', targetEvent);
    },
    _menuClosed: function() {
        this.get('testPage').set('targetEvent', false);
    },
    _menuItemCompleted: function(item) {
        if (item instanceof SelectParentMenuItem) {
            this.get('testPage').selectTarget(item.get('target').parent().get(0));
        }
    }
})