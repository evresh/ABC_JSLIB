var EditorOperations = (function() {
    function notImplementedYet() {
        alert('Not implemented yet');
    }

    var operations = {
        editHTML: 'HTMLOperation',
        edit: 'HTMLOperation',
        remove: 'RemoveOperation',
        visibility: 'VisibilityOperation',
        changeCSS: 'ChangeCSSOperation',
        changeText: notImplementedYet,
        changeImage: notImplementedYet,
        editImage: notImplementedYet,
        changeBackgroundImage: notImplementedYet,
        editBackgroundImage: notImplementedYet,
        rearrange: notImplementedYet,
        move: notImplementedYet,
        resize: notImplementedYet
    }

    return {
        create: function(type, target) {
            var ctor = operations[type];
            if (ctor) {
                return new (_.isString(ctor) ? window[ctor] : ctor)({
                    type: type,
                    target: target
                });
            } else {
                Debug.trace('EditorOperations.create() -> unknown type');
            }
        },
        isValidTypeForOperation: function(operation, type) {
            return operation instanceof window[operations[type]];
        }
    }
})();