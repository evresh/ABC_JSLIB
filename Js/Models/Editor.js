var Editor = Backbone.Model.extend({
    defaults: {
        testPage: null,
        menu: null
    },
    initialize: function() {
        this.set('testPage', new TestPage({ pageUrl: this.get('pageUrl') }));
        this.get('testPage').on('change:isSelected', this._targetSelected, this);
    },
    save: function() {
        alert('Not implemented yet');
    },
    _targetSelected: function() {
        var testPage = this.get('testPage');
        if (testPage.get('isSelected')) {
            var menu = new EditorMenu({ target: testPage.get('target') });
            menu.on('change:isRemoved', this._removeMenu, this);
            this.set('menu', menu);
        } else {
            this._removeMenu();
        }
    },
    _removeMenu: function() {
        if (this.get('menu')) {
            this.get('menu').off('close', this._removeMenu, this);
            this.set('menu', null);
            this.get('testPage').set('isSelected', false);
        }
    }
})