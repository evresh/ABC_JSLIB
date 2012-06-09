test('ResizeOperation tests', function() {
    var targetElement = $('<div>').css('width', '200px').css('height', '100px');
    var target = new EditorTarget({ element: targetElement });
    var operation = new ResizeOperation({ target: target });
    var widthItem = operation.getItem('width');
    var heightItem = operation.getItem('height');

    equal(widthItem.getValue(), '200px', 'Width item is correctly initialized');
    equal(targetElement.css('width'), '200px', 'Width item is correctly initialized (targetElement state)');
    equal(heightItem.getValue(), '100px', 'Height item is correctly initialized');
    equal(targetElement.css('height'), '100px', 'Height item is correctly initialized (targetElement state)');

    operation.edit();
    widthItem.apply('400px');
    heightItem.apply('300px');
    operation.cancel();
    equal(widthItem.getValue(), '200px', 'Width item keeps its initial value after cancel');
    equal(targetElement.css('width'), '200px', 'Width item keeps its initial value after cancel (targetElement state)');
    equal(heightItem.getValue(), '100px', 'Height item keeps its initial value after cancel');
    equal(targetElement.css('height'), '100px', 'Height item keeps its initial value after cancel (targetElement state)');

    operation.edit();
    widthItem.apply('300px');
    heightItem.apply('150px');
    operation.complete();
    equal(widthItem.getValue(), '300px', 'Width item is correctly completed');
    equal(targetElement.css('width'), '300px', 'Width item is correctly completed (targetElement state)');
    equal(heightItem.getValue(), '150px', 'Height item is correctly completed');
    equal(targetElement.css('height'), '150px', 'Height item is correctly completed (targetElement state)');

    operation.edit();
    widthItem.apply('400px');
    heightItem.apply('300px');
    operation.cancel();
    equal(widthItem.getValue(), '300px', 'Width item keeps its previous value after cancel');
    equal(targetElement.css('width'), '300px', 'Width item keeps its previous value after cancel (targetElement state)');
    equal(heightItem.getValue(), '150px', 'Height item keeps its previous value after cancel');
    equal(targetElement.css('height'), '150px', 'Height item keeps its previous value after cancel (targetElement state)');

    operation.edit();
    targetElement.css('width', '500px').css('height', '400px');
    target.updated();
    equal(widthItem.getValue(), '500px', 'Width item is correctly updated on target update');
    equal(heightItem.getValue(), '400px', 'Height item is correctly updated on target update');

    operation.remove();
    equal(widthItem.getValue(), '200px', 'Width item returned to its initial value after remove');
    equal(targetElement.css('width'), '200px', 'Width item returned to its initial value after remove (targetElement state)');
    equal(heightItem.getValue(), '100px', 'Height item returned to its initial value after remove');
    equal(targetElement.css('height'), '100px', 'Height item returned to its initial value after remove (targetElement state)');
})