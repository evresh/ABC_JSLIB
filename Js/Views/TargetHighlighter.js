var TargetHighlighter = {
    highlight: function(target) {
        var body = $(target[0].ownerDocument).find('body');
        if (!body.find('.elementOutline').length)
            body.append($('#highlightElements').html());

        if (target.hasClass('elementOutline'))
            return;

        var offset = target.offset();
        var border = 2;
        var width = target.outerWidth();
        var height = target.outerHeight();

        body.find('.elementOutline').show();

        body.find('.leftOutline')
            .css({
                left: offset.left - border,
                top: offset.top,
                height: height
            })
        .end()
        .find('.rightOutline')
            .css({
                left: offset.left + width,
                top: offset.top,
                height: height
            })
        .end()
        .find('.topOutline')
            .css({
                left: offset.left - border,
                top: offset.top,
                width: 2 * border + width
            })
        .end()
        .find('.bottomOutline')
            .css({
                left: offset.left - border,
                top: offset.top + height,
                width: 2 * border + width
            })
        .end();
    },
    removeHighlight: function(target) {
        $(target[0].ownerDocument).find('.elementOutline').hide();
    }
}
