var Editor = Backbone.Model.extend({
    defaults: {
        testPage: null,
        menu: null,
        currentOperation: null
    },
    initialize: function() {
        this.set('testPage', new TestPage({ pageUrl: this.get('pageUrl') }));
        this.get('testPage').on('change:targetData', this._targetChanged, this);

        this.set('menu', new EditorMenu());
        this.get('menu').on('close', this._menuClosed, this);

        this.set('completedOperations', new Backbone.Collection());
    },
    save: function() {
        alert('Not implemented yet');
    },
    _targetChanged: function() {
        var targetData = this.get('testPage').get('targetData');
        this.get('menu').set('targetData', targetData);
    },
    _menuClosed: function(performedItem) {
        if (performedItem) {
            if (performedItem instanceof SelectParentMenuItem) {
                this.get('testPage').selectTarget(performedItem.get('parentTarget'));
            } else if (performedItem instanceof OperationMenuItem) {
                var operation = performedItem.get('operation');
                var completedOperation = this.get('completedOperations').find(function(o) {
                    return o.get('target')[0] == operation.get('target')[0]
                        && o.get('type') == operation.get('type');
                });
                if (completedOperation)
                    operation = completedOperation;
                this.set('currentOperation', completedOperation || operation);
                operation.on('change:isEditing', this._onOperationEditing, this);
                operation.set('lastAction', EditorOperationAction.none);
                operation.set('isEditing', true);
            }
        } else {
            this.get('testPage').unset('targetData');
        }
    },
    _onOperationEditing: function() {
        var operation = this.get('currentOperation');
        if (!operation.get('isEditing')) {
            if (operation.get('lastAction') == EditorOperationAction.complete) {
                if (!this.get('completedOperations').get(operation.get('id')))
                    this.get('completedOperations').add(operation);
            }
            operation.off('change:isEditing', this._onOperationEditing, this);
            this.unset('currentOperation');
            this.get('testPage').unset('targetData');
        }
    }
})