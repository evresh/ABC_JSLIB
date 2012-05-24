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
    _menuVisibilityChanged: function() {
        if (!this.get('menu').get('isVisible')) {
            var performedItem = this.get('menu').get('performedItem');
            if (performedItem) {
                if (performedItem instanceof SelectParentMenuItem) {
                    this.get('testPage').selectTarget(performedItem.get('target').parent());
                } else if (performedItem instanceof OperationMenuItem) {
                    var operation = this.get('completedOperations').find(function(o) {
                        return o.get('target')[0] == performedItem.get('target')[0]
                            && o.get('variant') == performedItem.get('variant');
                    });
                    if (!operation) {
                        operation = new (performedItem.get('type'))({
                            target: performedItem.get('target'),
                            variant: performedItem.get('variant')
                        });
                    }
                    this.set('currentOperation', operation);
                    operation.on('change:isEditing', this._onOperationEditing, this);
                    operation.set('lastAction', EditorOperationAction.none);
                    operation.set('isEditing', true);
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
                if (!this.get('completedOperations').get(operation.get('id')))
                    this.get('completedOperations').add(operation);
            }
            operation.off('change:isEditing', this._onOperationEditing, this);
            this.unset('currentOperation');
            this.get('testPage').unset('targetData');
        }
    }
})