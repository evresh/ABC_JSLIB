test('ChangeTextOperation tests', function() {
    var menuItem = new ChangeTextOperationMenuItem();

    var target = $('<div>').html('<h1>Test</h1>');
    menuItem.set('target', target);
    menuItem.update();
    equal(menuItem.get('isVisible'), false, 'Menu is not visible for elements with inner tags');

    target = $('<input>').val('Test!');
    menuItem.set('target', target);
    menuItem.update();
    equal(menuItem.get('isVisible'), false, 'Menu is not visible for INPUTs');

    target = $('<img>').attr('src', 'http://somewhere.com/_.gif');
    menuItem.set('target', target);
    menuItem.update();
    equal(menuItem.get('isVisible'), false, 'Menu is not visible for IMGs');

    target = $('<span>Test</span>');
    menuItem.set('target', target);
    menuItem.update();
    equal(menuItem.get('isVisible'), true, 'Menu is visible for the rest of elements');

    var operation = new ChangeTextOperation({ target: target });
    operation.apply('Test!!!');
    equal(operation.getValue(), 'Test!!!', 'Apply of the changed text');
    equal(target.text(), 'Test!!!', 'Apply of the changed text (target state)');

    operation.cancel();
    equal(operation.getValue(), 'Test', 'Cancel applied changes');
    equal(target.text(), 'Test', 'Cancel applied changes (target state)');

    operation.apply('Test!!!!!!');
    operation.complete();
    equal(operation.getValue(), 'Test!!!!!!', 'Complete applied changes');
    equal(target.text(), 'Test!!!!!!', 'Complete applied changes (target state)');

    operation.apply('Test');
    operation.cancel();
    equal(operation.getValue(), 'Test!!!!!!', 'Cancel applied changes, in the prevous step it was completed');
    equal(target.text(), 'Test!!!!!!', 'Cancel applied changes, in the prevous step it was completed (target state)');
})