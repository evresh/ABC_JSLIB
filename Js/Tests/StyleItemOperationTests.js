test('StyleItemOperation tests', function() {
    var targetElement = $('<div>').css('text-transform', 'capitalize');
    var operation = new StyleItemOperation({
        group: "Text",
        property: "text-transform",
        target: new EditorTarget({ element: targetElement })
    });
    equal(operation.getValue(), 'capitalize', 'Initial operation state');

    operation.apply('lowercase');
    operation.cancel();
    equal(operation.getValue(), 'capitalize', 'Operation state after cancel before complete');
    equal(targetElement.css('text-transform'), 'capitalize', 'Target state after cancel before complete');

    operation.apply('uppercase');
    operation.complete();
    equal(operation.getValue(), 'uppercase', 'Operation state after complete');
    equal(targetElement.css('text-transform'), 'uppercase', 'Target state after complete');

    operation.apply('lowercase');
    operation.cancel();
    equal(operation.getValue(), 'uppercase', 'Operation state after cancel');
    equal(targetElement.css('text-transform'), 'uppercase', 'Target state after cancel');

    operation.remove();
    equal(operation.getValue(), 'capitalize', 'Operation state after remove');
    equal(targetElement.css('text-transform'), 'capitalize', 'Target state after remove');

    targetElement = $('<div>').css('text-transform', 'capitalize').css('font-family', 'Arial');
    operation = new StyleItemOperation({
        group: "Text",
        property: "text-transform",
        target: new EditorTarget({ element: targetElement })
    });
    operation.apply('uppercase');
    operation.complete();
    operation.set('property', 'font-family');
    equal(targetElement.css('text-transform'), 'capitalize', 'Target state was reseted correctly after property name was changed');
    equal(operation.getValue(), 'Arial', 'Operation state was reseted correctly after property name was changed');
});