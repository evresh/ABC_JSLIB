var Editor = Backbone.Model.extend({
    defaults: {
        menu: null,
        target: null,
        currentOperation: null
    },
    initialize: function() {
        this.set('menu', new EditorMenu());
        this.get('menu').on('change:isVisible', this._menuVisibilityChanged, this);

        this.set('completedOperations', new Backbone.Collection());
    },
    save: function() {
        alert('Not implemented yet');
    },
    setTarget: function(targetElement, pageX, pageY) {
        if (!targetElement || !targetElement.length) {
            this.unset('target');
        } else {
            var target;
            var operation = this.get('completedOperations').find(function(o) {
                return o.get('target').get('element')[0] == targetElement[0];
            });
            if (operation) {
                target = operation.get('target');
                target.set('pageX', pageX);
                target.set('pageY', pageY);
            } else {
                target = new EditorTarget({
                    element: targetElement,
                    pageX: pageX,
                    pageY: pageY
                });
            }
            this.set('target', target);
            target.edit();
        }

        var currentOperation = this.get('currentOperation');
        if (currentOperation) {
            currentOperation.cancel();
        } else {
            var target = this.get('target');
            this.get('menu').set('target', target);
            this.get('menu').set('isVisible', !!target);
        }
    },
    _setCurrentOperation: function(operation) {
        this.set('currentOperation', operation);
        operation.on('change:isEditing', this._onOperationEditing, this);
        operation.set('lastAction', EditorOperationAction.none);
        operation.edit();
    },
    _menuVisibilityChanged: function() {
        if (!this.get('menu').get('isVisible')) {
            var performedItem = this.get('menu').get('performedItem');
            if (performedItem) {
                var type = performedItem.get('type');
                if (type == 'selectParent') {
                    this.setTarget(this.get('target').get('element').parent());
                } else {
                    var operation = this.get('completedOperations').find(_.bind(function(o) {
                        return o.get('type') == type
                            && o.get('target').get('element')[0] == this.get('target').get('element')[0];
                    }, this));
                    if (operation)
                        operation.set('target', this.get('target')); // update target object, target element remains the same
                    else
                        operation = EditorOperation.createMain(type, this.get('target'));
                    this._setCurrentOperation(operation);
                }
            } else {
                this.set('target', null);
            }
        }
    },
    _onOperationEditing: function() {
        var operation = this.get('currentOperation');
        if (operation && !operation.get('isEditing')) {
            if (operation.get('lastAction') == EditorOperationAction.complete) {
                var overwrittenOperation = this.get('completedOperations').find(function(o) {
                    return o == operation || operation.isOverriding(o);
                });
                if (overwrittenOperation)
                    this.get('completedOperations').remove(overwrittenOperation);
                this.get('completedOperations').add(operation);
            }
            operation.off('change:isEditing', this._onOperationEditing, this);

            var operationToSwitch = operation.get('switchedTo');
            if (operation.get('lastAction') == EditorOperationAction.cancel && operationToSwitch) {
                this._setCurrentOperation(operationToSwitch);
            } else {
                this.set('currentOperation', null);
                this.setTarget(null);
            }

            if (operation.get('isNew'))
                operation.remove();
        }
    }
})