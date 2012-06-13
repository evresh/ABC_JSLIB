test('AttributeItemOperation tests', function() {
    var targetElement = $('<div>').attr('title', 'Test title');
    var operation = new AttributeItemOperation({
        property: "title",
        target: new EditorTarget({ element: targetElement })
    });
    equal(operation.getValue(), 'Test title', 'Initial operation state');

    operation.apply('Test title!!!');
    operation.cancel();
    equal(operation.getValue(), 'Test title', 'Operation state after cancel before complete');
    equal(targetElement.attr('title'), 'Test title', 'Target state after cancel before complete');

    operation.apply('Test title!!!');
    operation.complete();
    equal(operation.getValue(), 'Test title!!!', 'Operation state after complete');
    equal(targetElement.attr('title'), 'Test title!!!', 'Target state after complete');

    operation.apply('Test title!!!!!!');
    operation.cancel();
    equal(operation.getValue(), 'Test title!!!', 'Operation state after cancel');
    equal(targetElement.attr('title'), 'Test title!!!', 'Target state after cancel');

    operation.remove();
    equal(operation.getValue(), 'Test title', 'Operation state after remove');
    equal(targetElement.attr('title'), 'Test title', 'Target state after remove');
});