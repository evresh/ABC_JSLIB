test('StyleItemOperation tests', function() {
    var target = $('<div>').css('text-transform', 'capitalize');
    var operation = new StyleItemOperation({
        group: "Text",
        property: "text-transform",
        target: target
    });
    equal(operation.getValue(), 'capitalize', 'Initial operation state');

    operation.apply('lowercase');
    operation.cancel();
    equal(operation.getValue(), 'capitalize', 'Operation state after cancel before complete');
    equal(target.css('text-transform'), 'capitalize', 'Target state after cancel before complete');

    operation.apply('uppercase');
    operation.complete();
    equal(operation.getValue(), 'uppercase', 'Operation state after complete');
    equal(target.css('text-transform'), 'uppercase', 'Target state after complete');

    operation.apply('lowercase');
    operation.cancel();
    equal(operation.getValue(), 'uppercase', 'Operation state after cancel');
    equal(target.css('text-transform'), 'uppercase', 'Target state after cancel');

    operation.remove();
    equal(operation.getValue(), 'capitalize', 'Operation state after remove');
    equal(target.css('text-transform'), 'capitalize', 'Target state after remove');

    target = $('<div>').css('text-transform', 'capitalize').css('font-family', 'Arial');
    operation = new StyleItemOperation({
        group: "Text",
        property: "text-transform",
        target: target
    });
    operation.apply('uppercase');
    operation.complete();
    operation.set('property', 'font-family');
    equal(target.css('text-transform'), 'capitalize', 'Target state was reseted correctly after property name was changed');
    equal(operation.getValue(), 'Arial', 'Operation state was reseted correctly after property name was changed');
});