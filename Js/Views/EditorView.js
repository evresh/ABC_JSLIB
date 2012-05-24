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
        this._operationViews = {};
        this.model.on('change:currentOperation', this._currentOperationChanged, this);
    },
    render: function() {
        this._testView.render();
        this._menuView.render();

        return this;
    },
    _currentOperationChanged: function() {
        var operation = this.model.get('currentOperation');
        var variant;
        if (operation && (variant = operation.get('variant'))) {
            var viewName = variant + 'View';
            var view = this._operationViews[viewName];
            if (!view)
                this._operationViews[viewName] = new (window[viewName])({ model: operation }).render();
            else
                view.setModel(operation);
        }
    },
    _save: function() {
        this.model.save();
    }
})