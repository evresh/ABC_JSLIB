var EditorMenuView = Backbone.View.extend({
    initialize: function() {
        this.model.on('change:isVisible', this._visibilityChanged, this);
        this._overlay = new EditorOverlayView();
        this._overlay.on('close', this._close, this);
    },
    render: function() {
        this._overlay.options.frame = this.options.frame;
        this._overlay.render();
        var menu = $('<ul>').addClass('editorMenu');
        this.model.get('items').each(_.bind(function(item) {
            var view = new EditorMenuItemView({ model: item });
            view.render().$el.appendTo(menu);
        }, this));
        this._overlay.setContent(menu);

        return this;
    },
    _visibilityChanged: function() {
        var isOverlayVisible = this._overlay.$el.is(':visible');
        if (this.model.get('isVisible')) {
            var targetData = this.model.get('targetData');
            var tagName = targetData.target.tagName.toLowerCase();
            this._overlay
                .setTitle('<nobr>' + this._getTagDescription(tagName) + '</nobr>&nbsp;<i>&lt;' + tagName + '&gt;</i>')
                .show(targetData);
        } else if (isOverlayVisible) {
            this._overlay.close();
        }
    },
    _close: function() {
        this.model.set('isVisible', false);
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