var EditorView = Backbone.View.extend({
    events: {
        'click .saveChanges': '_save'
    },
    initialize: function() {
        this._testView = new TestPageView({
            model: this.model.get('testPage'),
            excludeHeightSelector: '.topBar'
        });
        this._menuView = new EditorMenuView({
            el: this.$('.editorMenu'),
            model: this.model
        });

        this.model.on('change:menu', this._menuChanged, this);
    },
    render: function() {
        this._testView.render().$el.appendTo(this.$('.testPageContainer'));

        return this;
    },
    _save: function() {
        this.model.save();
    },
    _menuChanged: function() {
        var menu = this.model.get('menu');
        if (menu) {
            this._menuView = new EditorMenuView({
                model: menu,
                event: this._testView.getLastClickEvent(),
                iframe: this._testView.getIframe(),
                iframeDocument: this._testView.getIframeDocument()
            });
            this._menuView.render().$el.appendTo(this.$('.editorMenuContainer'));
            this._menuView.open();
        } else {
            this._menuView.close();
            this._menuView = null;
        }
    }
})