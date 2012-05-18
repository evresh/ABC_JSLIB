var EditorView = Backbone.View.extend({
    events: {
        'click .saveChanges': '_save'
    },
    initialize: function() {
        this._testView = new TestPageView({
            el: this.$('.testPageContainer'),
            model: this.model.get('testPage')
        });
        this._menuView = new EditorMenuView({
            el: this.$('.editorMenu'),
            model: this.model.get('menu')
        });
    },
    render: function() {
        this._testView.render();

        this._menuView.options = $.extend(this._menuView.options, {
            iframe: this._testView.getIframe(),
            iframeDocument: this._testView.getIframeDocument()
        });
        this._menuView.render();

        return this;
    },
    _save: function() {
        this.model.save();
    }
})