test('ChangeCSSOperation tests', function() {
    var targetElement = $('<div>').hide().css('text-decoration', 'underline').appendTo('body');
    var changeCSS = new ChangeCSSOperation({ target: new EditorTarget({ element: targetElement }) });
    changeCSS.edit();

    function getTempItems(property) { return changeCSS.get('tempItems').select(function(item) { return item.get('property') == (property || 'text-decoration'); }); }
    function getItem(property) { return changeCSS.get('items')[property || 'text-decoration']; }

    var item = getTempItems()[0];
    equal(item.getValue(), 'underline', 'Item initialization');

    item.apply('overline');
    item.complete();
    changeCSS.cancel();
    equal(item.getValue(), 'underline', 'Item was completed, but ChangeCSS was cancelled');
    equal(targetElement.css('text-decoration'), 'underline', 'Item was completed, but ChangeCSS was cancelled (targetElement state)');

    changeCSS.edit();
    item = getTempItems()[0];

    item.apply('overline');
    item.complete();
    changeCSS.complete();
    equal(getItem().getValue(), 'overline', 'Item was completed and ChangeCSS was completed');
    equal(targetElement.css('text-decoration'), 'overline', 'Item was completed and ChangeCSS was completed (targetElement state)');

    changeCSS.edit();
    item = getTempItems()[0];
    item.apply('line-through');
    item.complete();
    changeCSS.cancel();
    equal(getItem().getValue(), 'overline', 'Item was completed, but ChangeCSS was cancelled, in the previous step it was completed');
    equal(targetElement.css('text-decoration'), 'overline', 'Item was completed, but ChangeCSS was cancelled, in the previous step it was completed (targetElement state)');

    changeCSS.edit();
    customItem = changeCSS.createCustomItem();
    ok(customItem.getTargetElement()[0] == targetElement[0] && customItem.isCustom(), 'Custom item initialization');

    customItem.set('property', 'text-indent');
    customItem.apply('3px');
    customItem.complete();
    changeCSS.cancel();
    equal(getItem('text-indent'), null, 'Custom item was added, but ChangeCSS was cancelled');
    equal(targetElement.css('text-indent'), '0px', 'Custom item was added, but ChangeCSS was cancelled (targetElement state)');

    changeCSS.edit();
    customItem = changeCSS.createCustomItem();
    customItem.set('property', 'text-indent');
    customItem.apply('3px');
    customItem.complete();
    changeCSS.complete();
    equal(getItem('text-indent'), customItem, 'Custom item was added and ChangeCSS was completed');

    changeCSS.edit();
    customItem = getTempItems('text-indent')[0];
    customItem.apply('5px');
    customItem.complete();
    changeCSS.cancel();
    equal(getItem('text-indent').getValue(), '3px', 'Custom item value was not saved after ChangeCSS was cancelled');
    equal(targetElement.css('text-indent'), '3px', 'Custom item value was not saved after ChangeCSS was cancelled (targetElement state)');

    changeCSS.edit();
    customItem = getTempItems('text-indent')[0];
    customItem.remove();
    changeCSS.cancel();
    ok(!!getItem('text-indent'), 'Remove previously completed custom item and cancel ChangeCSS');
    equal(targetElement.css('text-indent'), '3px', 'Remove previously completed custom item and cancel ChangeCSS (targetElement state)');

    changeCSS.edit();
    customItem = getTempItems('text-indent')[0];
    customItem.remove();
    changeCSS.complete();
    ok(!getItem('text-indent'), 'Remove previously completed custom item and complete ChangeCSS');
    equal(targetElement.css('text-indent'), '0px', 'Remove previously completed custom item and complete ChangeCSS (targetElement state)');

    changeCSS.edit();
    customItem = changeCSS.createCustomItem();
    customItem.set('property', 'text-decoration');
    customItem.apply('line-through');
    customItem.complete();
    items = getTempItems();
    ok(items.length == 2 && !items[0].isCustom() && items[0].getValue() == 'line-through', 'Item was updated after changing the same custom item');
    equal(targetElement.css('text-decoration'), 'line-through', 'Item was updated after changing the same custom item (targetElement state)');

    changeCSS.cancel();
    ok(getItem().getValue() == 'overline', 'Item was cancelled, custom item was removed after cancelling ChangeCSS');
    equal(targetElement.css('text-decoration'), 'overline', 'Item was cancelled, custom item was removed after cancelling ChangeCSS (targetElement state)');

    targetElement.remove();

    targetElement = $('<div>').hide().appendTo('body');
    changeCSS = new ChangeCSSOperation({ target: new EditorTarget({ element: targetElement }) });

    changeCSS.edit();
    customItem = changeCSS.createCustomItem();
    customItem.set('property', 'text-transform');
    customItem.apply('uppercase');
    customItem.complete();
    var item = getTempItems('text-transform')[0];
    item.apply('lowercase');
    item.complete();
    customItem.remove();
    changeCSS.complete();
    equal(getItem('text-transform').getValue(), 'lowercase', 'Completed item was handled correctly when the same custom item was removed');
    equal(targetElement.css('text-transform'), 'lowercase', 'Completed item was handled correctly when the same custom item was removed');
});