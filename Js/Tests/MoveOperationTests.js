test('MoveOperation tests', function() {
    var targetElement = $('<div>').appendTo($('body'));
    var target = new EditorTarget({ element: targetElement });
    var operation = new MoveOperation({ target: target });
    var topItem = operation.getItem('top');
    var leftItem = operation.getItem('left');

    equal(topItem.getValue(), 'auto', 'Top item is correctly initialized');
    equal(leftItem.getValue(), 'auto', 'Left item is correctly initialized');

    operation.edit();
    topItem.apply('400px');
    leftItem.apply('300px');
    operation.cancel();
    equal(topItem.getValue(), 'auto', 'Top item keeps its initial value after cancel');
    equal(targetElement.css('top'), 'auto', 'Top item keeps its initial value after cancel (targetElement state)');
    equal(leftItem.getValue(), 'auto', 'Left item keeps its initial value after cancel');
    equal(targetElement.css('left'), 'auto', 'Left item keeps its initial value after cancel (targetElement state)');
    equal(targetElement.css('position'), 'static', 'Left item keeps its initial value after cancel (targetElement state)');

    operation.edit();
    topItem.apply('300px');
    leftItem.apply('150px');
    operation.complete();
    equal(topItem.getValue(), '300px', 'Top item is correctly completed');
    equal(targetElement.css('top'), '300px', 'Top item is correctly completed (targetElement state)');
    equal(leftItem.getValue(), '150px', 'Left item is correctly completed');
    equal(targetElement.css('left'), '150px', 'Left item is correctly completed (targetElement state)');
    equal(targetElement.css('position'), 'relative', 'Target element position changed to "relative" after completion');

    operation.edit();
    topItem.apply('400px');
    leftItem.apply('300px');
    operation.cancel();
    equal(topItem.getValue(), '300px', 'Top item keeps its previous value after cancel');
    equal(targetElement.css('top'), '300px', 'Top item keeps its previous value after cancel (targetElement state)');
    equal(leftItem.getValue(), '150px', 'Left item keeps its previous value after cancel');
    equal(targetElement.css('left'), '150px', 'Left item keeps its previous value after cancel (targetElement state)');
    equal(targetElement.css('position'), 'relative', 'Target element keeps a position "relative" after cancel');

    operation.edit();
    targetElement.css('top', '500px').css('left', '400px');
    target.edited();
    equal(topItem.getValue(), '500px', 'Top item is correctly updated on target update');
    equal(leftItem.getValue(), '400px', 'Left item is correctly updated on target update');

    operation.remove();
    equal(topItem.getValue(), 'auto', 'Top item returned to its initial value after remove');
    equal(targetElement.css('top'), 'auto', 'Top item returned to its initial value after remove (targetElement state)');
    equal(leftItem.getValue(), 'auto', 'Left item returned to its initial value after remove');
    equal(targetElement.css('left'), 'auto', 'Left item returned to its initial value after remove (targetElement state)');
    equal(targetElement.css('position'), 'static', 'Target element position returned to its initial value after remove');

    targetElement.remove();
});