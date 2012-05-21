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
        this.model.on('change:currentOperation', this._currentOperationChanged, this);
    },
    render: function() {
        this._testView.render();
        this._menuView.render();

        return this;
    },
    _currentOperationChanged: function() {
        var operation = this.model.get('currentOperation');
        if (operation) {
            var subType = operation.get('subType');
            if (subType)
                new (window[subType + 'View'])({ model: operation }).render();
        }
    },
    _save: function() {
        this.model.save();
    }
})