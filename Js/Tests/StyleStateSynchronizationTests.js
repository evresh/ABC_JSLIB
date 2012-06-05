test('Style state synchronization tests', function() {
    var target = $('<div>').css('width', '100px');
    var operation1 = new StyleItemOperation({
        property: "width",
        target: target
    });

    operation1.apply('200px');
    operation1.complete();
    equal(operation1.getValue(), '200px', 'First operation completed correctly');
    equal(target.css('width'), '200px', 'First operation completed correctly (target state)');

    var operation2 = new StyleItemOperation({
        property: "width",
        target: target
    });
    operation2.apply('300px');
    operation2.complete();

    equal(operation2.getValue(), '300px', 'Second operation completed correctly');
    equal(target.css('width'), '300px', 'Second operation completed correctly (target state)');
    equal(operation1.getValue(), '300px', 'First operation synchronized its value with second operation');

    var operation3 = new StyleItemOperation({
        property: "width",
        target: target
    });
    operation3.apply('400px');
    operation3.complete();
    equal(operation3.getValue(), '400px', 'Third operation completed correctly');
    equal(target.css('width'), '400px', 'Third operation completed correctly (target state)');
    equal(operation2.getValue(), '400px', 'Second operation synchronized its value with third operation');
    equal(operation1.getValue(), '400px', 'First operation synchronized its value with third operation');

    operation3.remove();
    equal(operation2.getValue(), '300px', 'Second operation has a its old value after third operation removing');
    equal(target.css('width'), '300px', 'Second operation has a its old value after third operation removing (target state)');
    equal(operation1.getValue(), '300px', 'First operation synchronized its value with second operation after third operation removing');

    operation1.apply('500px');
    operation1.complete();
    equal(operation1.getValue(), '500px', 'First operation has been completed and now it has its new value (not from second operation)');
    equal(target.css('width'), '500px', 'First operation has been completed and now it has its new value (target state)');
    equal(operation2.getValue(), '500px', 'Second operation synchronized its value with first operation after first operation completion');

    operation2.remove();
    equal(operation1.getValue(), '500px', 'First operation still has its new value after second operation removing');
    equal(target.css('width'), '500px', 'First operation still has its new value after second operation removing (target state)');

    operation1.remove();
    equal(target.css('width'), '100px', 'After all operations are removed target has it initial value');
});