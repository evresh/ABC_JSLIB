var StyleOperationStateSynchronizer = (function() {
    var syncObj = {};

    function getOperations(operation) {
        var target = operation.get('target');

        var targetId = target.attr('editor_target_id');
        if (!targetId) {
            targetId = Tools.createUID();
            target.attr('editor_target_id', targetId);
        }

        var syncId = operation.get('property') + '_' + operation.get('target').attr('editor_target_id');
        var operations = syncObj[syncId];
        if (!operations) {
            syncObj[syncId] = operations = {
                list: [],
                initialState: operation.get('initialState')
            };
        }

        return operations;
    }

    return {
        update: function(operation) {
            var operations = getOperations(operation);

            var index = -1;
            $.each(operations.list, function(i, op) {
                if (op == operation) {
                    index = i;
                } else {
                    op.resetState(operation.getValue());
                }
            });

            operation.set('originalStates', {
                initialState: operation.get('initialState'),
                previousState: operation.get('previousState'),
                changedState: operation.get('changedState')
            });
            if (index == -1) {
                operations.list.push(operation);
            } else if (operations.list.length > 1) {
                operations.list = _.without(operations.list, operation);
                operations.list.push(operation);
            }
        },
        synchronize: function(operation) {
            var operations = getOperations(operation);
            if (_.indexOf(operations, operation) == -1) {
                operation.set('originalStates', {
                    initialState: operation.get('initialState'),
                    previousState: operation.get('previousState'),
                    changedState: operation.get('changedState')
                });
                operations.list.unshift(operation);
                if (operations.list.length > 1)
                    operation.resetState(_.last(operations.list).getValue());
            }
        },
        remove: function(operation, previousProperty) {
            var syncId = (previousProperty || operation.get('property')) + '_' + operation.get('target').attr('editor_target_id');
            var operations = syncObj[syncId];

            if (operations) {
                operations.list = _.without(operations.list, operation);
                if (operations.list.length > 0) {
                    var lastOperation = _.last(operations.list);
                    var originalStates = lastOperation.get('originalStates');
                    if (operations.list.length == 1)
                        originalStates.initialState = operations.initialState;

                    lastOperation.resetState(originalStates);

                    $.each(operations.list, function(i, op) {
                        if (op != lastOperation)
                            op.resetState(lastOperation.getValue());
                    });
                } else {
                    delete syncObj[syncId];
                }
            }
        }
    }
})();