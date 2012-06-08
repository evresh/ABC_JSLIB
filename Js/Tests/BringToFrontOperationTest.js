test('BringToFrontOperation tests', function() {
    var targetElement = $('<div>');
    var initialValue = targetElement.css('z-index');
    var operation = new BringToFrontOperation({ target: new EditorTarget({ element: targetElement }) });

    operation.apply(true);
    ok(operation.getValue(), 'Apply "true" was successful');
    equal(targetElement.css('z-index'), operation._zIndex, 'Apply "true" was successful (targetElement state)');

    operation.apply(false);
    equal(operation.getValue(), false, 'Apply "false" was successful');
    equal(targetElement.css('z-index'), initialValue, 'Apply "false" was successful (targetElement state)');

    operation.apply(true);
    operation.complete();
    operation.apply(false);
    equal(operation.getValue(), false, 'Apply "false" after completion "true" was successful');
    equal(targetElement.css('z-index'), initialValue, 'Apply "false" after completion "true" was successful (targetElement state)');

    operation.cancel();
    ok(operation.getValue(), 'Cancel "false" after completion "true" was successful');
    equal(targetElement.css('z-index'), operation._zIndex, 'Cancel "false" after completion "true" was successful');

    operation.apply(false);
    operation.complete();
    equal(operation.getValue(), false, 'Complete "false" after completion "true" was successful');
    equal(targetElement.css('z-index'), initialValue, 'Complete "false" after completion "true" was successful (targetElement state)');
})