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
        this.get('menu').on('change:isVisible', this._menuVisibilityChanged, this);

        this.set('completedOperations', new Backbone.Collection());
    },
    save: function() {
        alert('Not implemented yet');
    },
    _targetChanged: function() {
        var targetData = this.get('testPage').get('targetData');
        this.get('menu').set('targetData', targetData);
        this.get('menu').set('isVisible', !!targetData);
    },
    _setCurrentOperation: function(operation) {
        this.set('currentOperation', operation);
        operation.on('change:isEditing', this._onOperationEditing, this);
        operation.set('lastAction', EditorOperationAction.none);
        operation.set('isEditing', true);
    },
    _menuVisibilityChanged: function() {
        if (!this.get('menu').get('isVisible')) {
            var performedItem = this.get('menu').get('performedItem');
            if (performedItem) {
                if (performedItem instanceof SelectParentMenuItem) {
                    this.get('testPage').selectTarget(performedItem.get('target').parent());
                } else if (performedItem instanceof OperationMenuItem) {
                    var operation = this.get('completedOperations').find(function(o) {
                        return o.get('type') == performedItem.get('type')
                            && o.get('target')[0] == performedItem.get('target')[0];
                    });
                    if (!operation)
                        operation = EditorOperations.create(performedItem.get('type'), performedItem.get('target'));
                    this._setCurrentOperation(operation);
                }
            } else {
                this.get('testPage').unset('targetData');
            }
        }
    },
    _onOperationEditing: function() {
        var operation = this.get('currentOperation');
        if (!operation.get('isEditing')) {
            if (operation.get('lastAction') == EditorOperationAction.complete) {
                var overwrittenOperation = this.get('completedOperations').find(function(o) {
                    return o == operation || operation.isOverriding(o);
                });
                if (overwrittenOperation)
                    this.get('completedOperations').remove(overwrittenOperation);
                this.get('completedOperations').add(operation);
            }
            operation.off('change:isEditing', this._onOperationEditing, this);
            this.unset('currentOperation');

            var operationToSwitch = operation.get('switchedTo');
            if (operation.get('lastAction') == EditorOperationAction.cancel && operationToSwitch) {
                this._setCurrentOperation(operationToSwitch);
            } else {
                this.get('testPage').unset('targetData');
            }
        }
    }
})