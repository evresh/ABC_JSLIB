if (!$.browser.msie) { // a problem with caching images under IE during unit testing. However, everyting works fine during manual testing
    asyncTest('ChangeImageOperation tests', function() {
        var image1 = new Image();
        image1.onload = function() {
            var targetElement = $('<img>').attr('src', image1.src).css('visibility', 'hidden').appendTo($('body'));
            var operation = new ChangeImageOperation({ target: new EditorTarget({ element: targetElement }) });

            equal(operation.getItem('width').getValue(), image1.width + 'px', 'Width item correctly initialized');
            equal(operation.getItem('height').getValue(), image1.height + 'px', 'Height item correctly initialized');

            var src2 = '/img/tests/change-image-2.jpg';
            operation.edit();
            operation.getItem('src').apply(src2);
            var image2 = new Image();
            image2.onload = function() {
                equal(operation.getItem('src').getValue(), src2, 'Src item applied its value correctly');
                equal(targetElement.attr('src'), src2, 'Src item applied its value correctly (targetElement state)');
                equal(operation.getItem('width').getValue(), image2.width + 'px', 'Width item changed its value according to a new image');
                equal(operation.getItem('height').getValue(), image2.height + 'px', 'Height item changed its value according to a new image');

                operation.cancel();
                setTimeout(function() {
                    equal(operation.getItem('src').getValue(), image1.src, 'Src item correctly cancelled');
                    equal(targetElement.attr('src'), image1.src, 'Src item applied its value correctly (targetElement state)');
                    equal(operation.getItem('width').getValue(), image1.width + 'px', 'Width item correctly cancelled');
                    equal(operation.getItem('height').getValue(), image1.height + 'px', 'Height item correctly cancelled');

                    operation.edit();
                    operation.getItem('src').apply(src2);
                    setTimeout(function() {
                        operation.complete();
                        equal(operation.getItem('src').getValue(), src2, 'Src item completed correctly');
                        equal(targetElement.attr('src'), src2, 'Src item completed correctly (targetElement state)');
                        equal(operation.getItem('width').getValue(), image2.width + 'px', 'Width item completed correctly');
                        equal(operation.getItem('height').getValue(), image2.height + 'px', 'Height item completed correctly');

                        operation.edit();
                        operation.getItem('src').apply(image1.src);
                        setTimeout(function() {
                            operation.cancel();
                            equal(operation.getItem('src').getValue(), src2, 'Src item cancelled after completion correctly');
                            equal(targetElement.attr('src'), src2, 'Src item cancelled after completion correctly (targetElement state)');
                            equal(operation.getItem('width').getValue(), image2.width + 'px', 'Width item cancelled after completion correctly');
                            equal(targetElement.width(), image2.width, 'Width item cancelled after completion correctly (targetElement state)');
                            equal(operation.getItem('height').getValue(), image2.height + 'px', 'Height item cancelled after completion correctly');
                            equal(targetElement.height(), image2.height, 'Height item cancelled after completion correctly (targetElement state)');

                            operation.getItem('height').apply('700px');
                            operation.complete();
                            equal(operation.getItem('height').getValue(), '700px', 'Height item changed to a custom value correctly');
                            equal(targetElement.css('height'), '700px', 'Height item changed to a custom value correctly (targetElement state)');

                            operation.edit();
                            operation.getItem('src').apply(image1.src);
                            setTimeout(function() {
                                equal(operation.getItem('height').getValue(), '700px', 'Height item kept its custom value after changing image src');
                                equal(targetElement.css('height'), '700px', 'Height item kept its custom value after changing image src (targetElement state)');

                                targetElement.remove();
                                start();
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);

            }
            image2.src = src2;
        };
        image1.src = '/img/tests/change-image.jpg';
    })
}