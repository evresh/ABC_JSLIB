test('ChangeTextOperation tests', function() {
    var menuItem = new EditorMenuItem({ type: 'changeText' });

    var targetElement = $('<div>').html('<h1>Test</h1>');
    menuItem.set('targetElement', targetElement);
    menuItem.update();
    equal(menuItem.get('isVisible'), false, 'Menu is not visible for elements with inner tags');

    targetElement = $('<input>').val('Test!');
    menuItem.set('targetElement', targetElement);
    menuItem.update();
    equal(menuItem.get('isVisible'), false, 'Menu is not visible for INPUTs');

    targetElement = $('<img>').attr('src', 'http://somewhere.com/_.gif');
    menuItem.set('targetElement', targetElement);
    menuItem.update();
    equal(menuItem.get('isVisible'), false, 'Menu is not visible for IMGs');

    targetElement = $('<span>Test</span>');
    menuItem.set('targetElement', targetElement);
    menuItem.update();
    equal(menuItem.get('isVisible'), true, 'Menu is visible for the rest of elements');

    var operation = new ChangeTextOperation({ target: new EditorTarget({ element: targetElement }) });
    operation.apply('Test!!!');
    equal(operation.getValue(), 'Test!!!', 'Apply of the changed text');
    equal(targetElement.text(), 'Test!!!', 'Apply of the changed text (targetElement state)');

    operation.cancel();
    equal(operation.getValue(), 'Test', 'Cancel applied changes');
    equal(targetElement.text(), 'Test', 'Cancel applied changes (targetElement state)');

    operation.apply('Test!!!!!!');
    operation.complete();
    equal(operation.getValue(), 'Test!!!!!!', 'Complete applied changes');
    equal(targetElement.text(), 'Test!!!!!!', 'Complete applied changes (targetElement state)');

    operation.apply('Test');
    operation.cancel();
    equal(operation.getValue(), 'Test!!!!!!', 'Cancel applied changes, in the prevous step it was completed');
    equal(targetElement.text(), 'Test!!!!!!', 'Cancel applied changes, in the prevous step it was completed (targetElement state)');
})