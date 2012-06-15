var EditorTargetView = Backbone.View.extend({
    initialize: function() {
        this.model
            .on('edited', this._select, this)
            .on('change:editMode', this._modeChanged, this);
    },
    render: function() {
        var body = this.model.getDocument().find('body');
        if (!body.find('.elementOutlineBackground').length)
            body.append($('#selectedTargetElements').html());

        return this;
    },
    _select: function() {
        var doc = this.model.getDocument();

        var el = this.model.get('element'),
            offset = el.offset(),
            docH = doc.height(),
            docW = doc.width(),
            height = el.outerHeight();

        if (el.is(':hidden')) {
            this._hide();
            return;
        }

        TargetHighlighter.highlight(el);

        doc.find('.elementOutlineBackground,.elementGlassBackground').show();

        doc.find('.topOutlineBackground')
            .css({
                top: 0,
                left: 0,
                height: offset.top,
                width: docW
            })
        .end()
        .find('.leftOutlineBackground')
            .css({
                top: offset.top,
                left: 0,
                height: height,
                width: offset.left
            })
        .end()
        .find('.bottomOutlineBackground')
            .css({
                top: offset.top + height,
                left: 0,
                width: docW,
                height: (docH - offset.top - height)
            })
        .end()
        .find('.rightOutlineBackground')
            .css({
                top: offset.top,
                left: offset.left + el.outerWidth(),
                height: height,
                width: (docW - offset.left - el.outerWidth())
            })
        .end();
            
        this._updateCover(doc.find('.elementGlassBackground,.resizeGlassLayer,.moveGlassLayer'));
    },
    _hide: function() {
        $(this.model.getDocument())
            .find('.elementOutlineBackground,.elementGlassBackground').hide().end()
            .find('.resizeGlassLayer').remove().end()
            .find('.moveGlassLayer').remove();

        if (this._moveOnKeydownHandler) {
            $('body').off('keydown', this._moveOnKeydownHandler);
            this._moveOnKeydownHandler = null;
        }

        TargetHighlighter.removeHighlight(this.model.get('element'));
    },
    _modeChanged: function() {
        var editMode = this.model.get('editMode');
        var doc = this.model.getDocument();
        var targetElement = this.model.get('element');
        var _this = this;

        switch(editMode) {
            case EditorTargetMode.editing:
                this._select();
                break;
            case EditorTargetMode.resize:
                if (!doc.find('.resizeGlassLayer').length)
                    doc.find('body').append($('#resizeTargetElements').html())

                this._updateCover(doc.find('.resizeGlassLayer')).drag('start', function(ev, dd) {
                    dd.attr = ev.target.className;
                    dd.width = targetElement.width();
                    dd.height = targetElement.height();
                }, { handle: '.resizeHandle' }).drag(function(ev, dd) {
                    var width, height;
                    if (dd.attr.indexOf("E") > -1) {
                        width = Math.max(20, dd.width + dd.deltaX);
                    }
                    if (dd.attr.indexOf("S") > -1) {
                        height = Math.max(20, dd.height + dd.deltaY);
                    }
                    if (dd.attr.indexOf("W") > -1) {
                        width = Math.max(20, dd.width - dd.deltaX);
                    }
                    if (dd.attr.indexOf("N") > -1) {
                        height = Math.max(20, dd.height - dd.deltaY);
                    }
                    height += 'px';
                    width += 'px';
                    targetElement.css('width', width).css('height', height);
                    _this.model.edited();
                });
                break;
            case EditorTargetMode.move:
                if (!doc.find('.moveGlassLayer').length)
                    doc.find('body').append($('<div>').addClass('moveGlassLayer'));

                var original_top, original_left;

                function updateOriginalValues() {
                    original_top = parseInt(targetElement.css('top'), 10) || 0;
                    original_left = parseInt(targetElement.css('left'), 10) || 0;
                }

                updateOriginalValues();

                this._updateCover(doc.find('.moveGlassLayer')).drag(function(ev, dd) {
                    targetElement.css('top', original_top + dd.deltaY).css('left', original_left + dd.deltaX);
                    _this.model.edited();
                }).drop(function() {
                    updateOriginalValues();
                });

                this._moveOnKeydownHandler = function(e) {
                    var dx = 0;
                    var dy = 0;
                    var shiftMoveAmount = 20;

                    if (e.target.tagName == 'INPUT')
                        return;

                    if (e.which == 37)
                        dx = e.shiftKey ? -shiftMoveAmount: -1;
                    else if (e.which == 39)
                        dx = e.shiftKey ? shiftMoveAmount: 1;
                    if (e.which == 38)
                        dy = e.shiftKey ? -shiftMoveAmount: -1;
                    else if (e.which == 40)
                        dy = e.shiftKey ? shiftMoveAmount: 1;

                    original_top = (parseInt(targetElement.css('top')) || 0) + dy;
                    original_left = (parseInt(targetElement.css('left')) || 0) + dx;

                    targetElement.css('top', original_top).css('left', original_left);
                    _this.model.edited();
                }
                $('body').on('keydown', this._moveOnKeydownHandler);
                break;
            case EditorTargetMode.none:
                this.model
                    .off('edited', this._select, this)
                    .off('change:editMode', this._modeChanged, this);

                this._hide();

                break;
        }
    },
    _updateCover: function(cover) {
        var targetElement = this.model.get('element');
        if (cover.length > 0) {
            cover.css({
                left: targetElement.offset().left,
                top: targetElement.offset().top,
                height: targetElement.outerHeight(),
                width: targetElement.outerWidth()
            });
        }

        return cover;
    }
});