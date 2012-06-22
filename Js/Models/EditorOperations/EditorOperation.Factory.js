EditorOperation.createMain = function(type, target) {
    var operations = {
        editHTML: HTMLOperation,
        edit: HTMLOperation,
        remove: RemoveOperation,
        visibility: VisibilityOperation,
        changeCSS: ChangeCSSOperation,
        changeText: ChangeTextOperation,
        changeImage: ChangeImageOperation,
        editImage: EditImageOperation,
        changeBackgroundImage: ChangeBackgroundImageOperation,
        editBackgroundImage: EditBackgroundImageOperation,
        //rearrange: notImplementedYet,
        move: MoveOperation,
        resize: ResizeOperation
    }

    var ctor = operations[type];
    if (ctor) {
        return new (ctor)({
            type: type,
            target: target
        });
    } else {
        Debug.trace('EditorOperations.createMainOperation() -> unknown type');
    }
}