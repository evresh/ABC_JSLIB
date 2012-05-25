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
    _initOperationView: function(operation) {
        var type = operation.get('type');
        var viewName = type.substr(0, 1).toUpperCase() + type.substr(1) + 'View';
        var view = this._operationViews[viewName];
        if (!view)
            view = this._operationViews[viewName] = new (window[viewName])({
                model: operation,
                frame: this._testView.getFrame()
            }).render();
        else
            view.setModel(operation);
        this._currentOperationView = view;
    },
    _currentOperationChanged: function() {
        var operation = this.model.get('currentOperation');
        if (operation) {
            this._initOperationView(operation);
            operation.on('change:type', this._currentOperationTypeChanged, this);
        } else {
            this._currentOperationView = null;
        }
        var previousOperation = this.model.previous('currentOperation');
        if (previousOperation)
            previousOperation.off('change:type', this._currentOperationTypeChanged, this);
    },
    _currentOperationTypeChanged: function() {
        $.when(this._currentOperationView.close(true)).done(_.bind(function() {
            this._initOperationView(this.model.get('currentOperation'));
            this._currentOperationView.show();
        }, this))
    },
    _save: function() {
        this.model.save();
    }
})