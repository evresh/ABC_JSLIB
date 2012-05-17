var EditorMenuView = Backbone.View.extend({
    className: 'editorMenu',
    events: {
        'click .closeButton': 'close'
    },
    initialize: function() {
        this._operationViews = [];
    },
    render: function() {
        var tagName = this.model.get('target')[0].tagName.toLowerCase();
        this.$el.hide().html(_.template($('#editorMenuTemplate').html(), {
            name: '&lt;' + tagName + '&gt;',
            description: this._getTagDescription(tagName)
        }));

        this.model.get('operations').each(_.bind(function(operation) {
            var view = new ElementOperationView({ model: operation });
            view.render().$el.appendTo(this.$el.find('ul'));
            this._operationViews.push(view);
        }, this));

        return this;
    },
    open: function() {
        this.$el.fadeIn(150);
        this._attachToTarget();
    },
    remove: function() {
        $.each(this._operationViews, function() { this.remove(); });
        this._operationViews = null;
        this.model = null;

        this.$el.remove();
    },
    close: function() {
        this.$el.fadeOut(150, _.bind(this.remove, this));
        this.model.set('isRemoved', true);
    },
    _attachToTarget: function() {
        /*
        if (!elem) {
            this.centerInClient();
            return this;
        }
        var rearrange = false;
        if (VWO.el.currentOp == 'rearrange') {
            elem = elem.parent();
            rearrange = true;
        }
        */
        var top, left, menu = this.$el,
        elem = this.model.get('target'),
        frame = this.options.iframe,
        frameDoc = this.options.iframeDocument,
        x = parseInt(this.options.event.pageX, 10) || 0 - window.pageXOffset,
        y = parseInt(this.options.event.pageY, 10) || 0 - window.pageYOffset,
        margin = 8,
        flag = false,
        eoW = elem.outerWidth(),
        eoH = elem.outerHeight(),
        eO = elem.offset(),
        eoL = eO.left,
        eoT = eO.top,
        fO = frame.offset(),
        foL = fO.left,
        foT = fO.top,
        foH = frame.outerHeight(),
        foW = frame.outerWidth(),
        moW = menu.outerWidth(),
        moH = menu.outerHeight(),
        tagName = elem.get(0).tagName;
        if ((x != 0 || y != 0 || tagName != 'HEAD') && tagName != 'BODY') {
            var adjustLeft = foL - (frame[0].contentWindow.pageXOffset || frameDoc[0].body.scrollLeft),
            adjustTop = foT - (frame[0].contentWindow.pageYOffset || frameDoc[0].body.scrollTop);
            var rspace = foW + foL - eoL - eoW;
            var lspace = foW - eoW - rspace;
            if (rspace > lspace) {
                left = eoL + eoW + margin + adjustLeft + 0/*VWO.dragX*/;
                //if (rearrange) left = left + 0.75 * margin;
            }
            else {
                left = eoL - moW - margin + adjustLeft + 0 /*VWO.dragX*/;
                //if (rearrange) left = left - 0.75 * margin;
            }
            if (eoW > 0.95 * foW || (moW > rspace && moW > lspace)) flag = true;
            top = eoT + adjustTop + 0/*VWO.dragY*/;
            if (flag) {
                var tspace = eoT - (frame[0].contentWindow.pageYOffset || frameDoc[0].body.scrollTop),
                bspace = foH - tspace - eoH;
                if (bspace > tspace)
                    top += eoH + margin;
                else
                    top = eoT + adjustTop - moH - margin;
            }
            //if (rearrange) top = top - 0.75 * margin;
            if (top + moH + margin > foH + foT)
                top = foH + foT - moH - margin;
            else if (top < foT + margin)
                top = foT + margin;
            if (left < foL)
                left = foL + margin;
            if (left + moW + margin > foW)
                left = foW - moW - margin;
        }
        else
            flag = true;
        if (flag) {
            left = x + foL + margin;
            if (top + moH > foH + foT) {
                top = foH + foT - moH;
            }
            if (top < foT + margin)
                top = foT + margin;
            if (left + moW > foW + foL)
                left = foW + foL - moW;
        }
        if (! ((left > eoL + eoW) || (left + moW < eoL)) && (/*VWO.dragX*/0 == 0) && (/*VWO.dragY*/0 == 0) && (top + moH + margin > foH + foT))
            top = top + margin;
        menu.get(0).style.left = left + 'px';
        menu.get(0).style.top = top + 'px';
    },
    _getTagDescription: function(tagName) {
        return {
            a: "Link",
            abbr: "Abbreviation",
            area: "Image Map Area",
            b: "Bold Text",
            big: "Big Text",
            blockquote: "Block Quote",
            br: "Line Break",
            cite: "Citation",
            col: "Column",
            colgroup: "Column Group",
            dd: "Definition List Description",
            del: "Deleted Text",
            dfn: "Definition",
            dir: "Directory List",
            div: "Division",
            dl: "Definition List",
            dt: "Definition List Item",
            em: "Emphasized Text",
            embed: "Embedded Object",
            eventsource: "Event Source",
            figcaption: "Figure Caption",
            h1: "Headline",
            h2: "Headline",
            h3: "Headline",
            h4: "Headline",
            h5: "Headline",
            h6: "Headline",
            head: 'Head',
            hgroup: "Section Header",
            hr: "Horizonal Rule",
            i: "Italic Text",
            iframe: "iFrame",
            img: "Image",
            input: "Input Field",
            ins: "Inserted Text",
            kbd: "Keyboard Text",
            li: "List Item",
            map: "Image Map",
            mark: "Marked Text",
            menu: "Menu List",
            nav: "Navigation Section",
            object: "Embedded Object",
            ol: "Ordered List",
            optgroup: "Option Group",
            option: "Selection Option",
            p: "Paragraph",
            param: "Object Parameter",
            pre: "Preformatted Text",
            q: "Quotation",
            samp: "Sample Output",
            select: "Selection List",
            span: "Span",
            small: "Small Text",
            strong: "Strong Text",
            sub: "Subscript Text",
            sup: "Superscript Text",
            tbody: "Table Body",
            td: "Table Data",
            textarea: "Text Field",
            tfoot: "Table Footer",
            th: "Table Header",
            thead: "Table Header",
            tr: "Table Row",
            tt: "Typewriter Text",
            u: "Underlined Text",
            ul: "Unordered List",
            form: "Form",
            button: "Button",
            legend: "Legend",
            label: "Label",
            table: "Table",
            address: "Address",
            noscript: "No Script",
            code: "Code",
            wbr: "Word Break",
            article: "Article",
            aside: "Aside",
            command: "Command",
            details: "Details",
            summary: "Summary",
            figure: "Figure",
            footer: "Footer",
            header: "Header",
            hgroup: "Hgroup",
            mark: "Mark",
            meter: "Meter",
            nav: "Navigation",
            progress: "Progress",
            section: "Section",
            time: "Time",
            canvas: "Canvas",
            "var": "Variable"
        }[tagName];
    }
});