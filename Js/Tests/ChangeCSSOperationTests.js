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

test('ChangeCSSOperation tests', function() {
    var target = $('<div>').hide().css('text-decoration', 'underline').appendTo('body');
    var changeCSS = new ChangeCSSOperation({ target: target });
    changeCSS.set('isEditing', true);

    function getTempItems(property) { return changeCSS.get('tempItems').select(function(item) { return item.get('property') == (property || 'text-decoration'); }); }
    function getItems(property) { return changeCSS.get('items').select(function(item) { return item.get('property') == (property || 'text-decoration'); }); }

    var item = getTempItems()[0];
    equal(item.getValue(), 'underline', 'Item initialization');

    item.apply('overline');
    item.complete();
    changeCSS.cancel();
    equal(item.getValue(), 'underline', 'Item was completed, but ChangeCSS was cancelled');
    equal(target.css('text-decoration'), 'underline', 'Item was completed, but ChangeCSS was cancelled (target state)');

    changeCSS.set('isEditing', true);
    item = getTempItems()[0];

    item.apply('overline');
    item.complete();
    changeCSS.complete();
    equal(getItems()[0].getValue(), 'overline', 'Item was completed and ChangeCSS was completed');
    equal(target.css('text-decoration'), 'overline', 'Item was completed and ChangeCSS was completed (target state)');

    changeCSS.set('isEditing', true);
    item = getTempItems()[0];
    item.apply('line-through');
    item.complete();
    changeCSS.cancel();
    equal(getItems()[0].getValue(), 'overline', 'Item was completed, but ChangeCSS was cancelled, in the previous step it was completed');
    equal(target.css('text-decoration'), 'overline', 'Item was completed, but ChangeCSS was cancelled, in the previous step it was completed (target state)');

    changeCSS.set('isEditing', true);
    customItem = changeCSS.createCustomItem();
    ok(customItem.get('target')[0] == target[0] && customItem.isCustom(), 'Custom item initialization');

    customItem.set('property', 'border-radius');
    customItem.apply('3px');
    customItem.complete();
    changeCSS.cancel();
    equal(getItems('border-radius')[0], null, 'Custom item was added, but ChangeCSS was cancelled');
    equal(target.css('border-radius'), '0px', 'Custom item was added, but ChangeCSS was cancelled (target state)');

    changeCSS.set('isEditing', true);
    customItem = changeCSS.createCustomItem();
    customItem.set('property', 'border-radius');
    customItem.apply('3px');
    customItem.complete();
    changeCSS.complete();
    equal(getItems('border-radius')[0], customItem, 'Custom item was added and ChangeCSS was completed');

    changeCSS.set('isEditing', true);
    customItem = getTempItems('border-radius')[0];
    customItem.apply('5px');
    customItem.complete();
    changeCSS.cancel();
    equal(getItems('border-radius')[0].getValue(), '3px', 'Custom item value was not saved after ChangeCSS was cancelled');
    equal(target.css('border-radius'), '3px', 'Custom item value was not saved after ChangeCSS was cancelled (target state)');

    changeCSS.set('isEditing', true);
    customItem = getTempItems('border-radius')[0];
    customItem.remove();
    changeCSS.cancel();
    ok(getItems('border-radius').length == 1, 'Remove previously completed custom item and cancel ChangeCSS');
    equal(target.css('border-radius'), '3px', 'Remove previously completed custom item and cancel ChangeCSS (target state)');

    changeCSS.set('isEditing', true);
    customItem = getTempItems('border-radius')[0];
    customItem.remove();
    changeCSS.complete();
    ok(getItems('border-radius').length == 0, 'Remove previously completed custom item and complete ChangeCSS');
    equal(target.css('border-radius'), '0px', 'Remove previously completed custom item and complete ChangeCSS (target state)');

    changeCSS.set('isEditing', true);
    customItem = changeCSS.createCustomItem();
    customItem.set('property', 'text-decoration');
    customItem.apply('line-through');
    customItem.complete();
    items = getTempItems();
    ok(items.length == 2 && !items[0].isCustom() && items[0].getValue() == 'line-through', 'Item was updated after changing the same custom item');
    equal(target.css('text-decoration'), 'line-through', 'Item was updated after changing the same custom item (target state)');

    changeCSS.cancel();
    var items = getItems();
    ok(items.length == 1 && !items[0].isCustom() && items[0].getValue() == 'overline', 'Item was cancelled, custom item was removed after cancelling ChangeCSS');
    equal(target.css('text-decoration'), 'overline', 'Item was cancelled, custom item was removed after cancelling ChangeCSS (target state)');

    target.remove();
});