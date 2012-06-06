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
        this._menuView.options.frame = this._testView.getFrame();
        this._menuView.render();

        return this;
    },
    _currentOperationChanged: function() {
        var prevOperation = this.model.previous('currentOperation');
        if (prevOperation) {
            prevOperation
                .off('change:changedState', this._onTargetUpdated, this)
                .off('targetUpdated', this._onTargetUpdated, this);
        }

        var operation = this.model.get('currentOperation');
        if (operation) {
            operation
                .on('change:changedState', this._onTargetUpdated, this)
                .on('targetUpdated', this._onTargetUpdated, this);

            var type = operation.get('type');
            var viewName = type.substr(0, 1).toUpperCase() + type.substr(1) + 'View';
            var viewCtor = window[viewName];
            if (viewCtor) {
                var view = this._operationViews[viewName];
                if (!view)
                    view = this._operationViews[viewName] = new (viewCtor)({
                        model: operation,
                        frame: this._testView.getFrame()
                    }).render();
                else
                    view.setModel(operation);

                var prevOperationView = this._currentOperationView;
                if (prevOperationView)
                    view.maximized(prevOperationView.maximized());

                this._currentOperationView = view;
                return;
            }
        }

        this._currentOperationView = null;
    },
    _onTargetUpdated: function() {
        this._testView.updateTargetEnvironment();
    },
    _save: function() {
        this.model.save();
    }
})