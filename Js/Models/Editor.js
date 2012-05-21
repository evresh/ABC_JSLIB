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
                this.set('currentOperation', operation);
                operation.on('cancel', this._operationCancelled, this);
            }
        } else {
            this.get('testPage').unset('targetData');
        }
    },
    _operationCancelled: function() {
        this.get('currentOperation').off('cancel', this._operationCancelled, this);
        this.unset('currentOperation');
        this.get('testPage').unset('targetData');
    }
})