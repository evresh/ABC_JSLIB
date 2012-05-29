var ChangeCSSOperation = Backbone.Model.extend({
    defaults: {
        lastAction: EditorOperationAction.none,
        isEditing: false
    },
    initialize: function() {
        var styleItems = Backbone.Collection.extend({ model: StyleItemOperation });
        this.set('items', new styleItems([
            {
                group: "Text",
                property: "font-family",
                //"values": "[ [<family-name>|<generic-family>] [,<family-name>|<generic-family>]* ] |inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "font-size",
                //"values": "<absolute-size>|<relative-size>|<length>|<percentage>|inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "font-weight",
                //"values": "normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "font-style",
                //"values": "normal | italic | oblique |inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "font-size-adjust",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "color",
                //"values": "<color>|inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "text-transform",
                //"values": "capitalize | uppercase | lowercase | none |inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "text-decoration",
                //"values": "none | [ underline || overline || line-through || blink ] |inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "letter-spacing",
                //"values": "normal |<length>|inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "word-spacing",
                //"values": "normal |<length>|inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "line-height",
                //"values": "normal |<number>|<length>|<percentage>|inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "text-align",
                //"values": "left | right | center | justify |inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "vertical-align",
                //"values": "baseline | sub | super | top | text-top | middle | bottom | text-bottom |<percentage>|<length>|inherit",
                target: this.get('target')
            },
            {
                group: "Text",
                property: "direction",
                //"values": "ltr | rtl |inherit",
                target: this.get('target')
            },
            {
                group: "Background",
                property: "background-color",
                //"values": "<color>|inherit",
                target: this.get('target')
            },
            {
                group: "Background",
                property: "background-image",
                //"values": "<uri>| none |inherit",
                target: this.get('target')
            },
            {
                group: "Background",
                property: "background-repeat",
                //"values": "repeat | repeat-x | repeat-y | no-repeat |inherit",
                target: this.get('target')
            },
            {
                group: "Background",
                property: "background-position",
                //"values": "[ [<percentage>|<length>| left | center | right ] [<percentage>|<length>| top | center | bottom ]? ] | [ [ left | center | right ] || [ top | center | bottom ] ] |inherit",
                target: this.get('target')
            },
            {
                group: "Background",
                property: "background-attachment",
                //"values": "scroll | fixed |inherit",
                target: this.get('target')
            },
            {
                group: "Background",
                property: "opacity",
                //"values": "<number>|inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "width",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "height",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "top",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "right",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "bottom",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "left",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "margin-top",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "margin-right",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "margin-bottom",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "margin-left",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "padding-top",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "padding-right",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "padding-bottom",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "padding-left",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Dimensions",
                property: "box-shadow",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-top-width",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-right-width",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-bottom-width",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-left-width",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-top-color",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-right-color",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-bottom-color",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-left-color",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-top-style",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-right-style",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-bottom-style",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Border",
                property: "border-left-style",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "position",
                //"values": "static | relative | absolute | fixed |inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "display",
                //"values": "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | none |inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "visibility",
                //"values": "visible | hidden | collapse |inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "z-index",
                //"values": "auto |<integer>|inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "overflow-x",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "overflow-y",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "white-space",
                //"values": "normal | pre | nowrap | pre-wrap | pre-line |inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "clip",
                //"values": "<shape>| auto |inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "float",
                //"values": "left | right | none |inherit",
                target: this.get('target')
            },
            {
                group: "Layout",
                property: "clear",
                //"values": "none | left | right | both |inherit",
                target: this.get('target')
            },
            {
                group: "Other",
                property: "cursor",
                //"values": "[ [<uri>,]* [ auto | crosshair | default | pointer | move | e-resize | ne-resize | nw-resize | n-resize | se-resize | sw-resize | s-resize | w-resize | text | wait | help | progress ] ] |inherit",
                target: this.get('target')
            },
            {
                group: "Other",
                property: "list-style-image",
                //"values": "<uri>| none |inherit",
                target: this.get('target')
            },
            {
                group: "Other",
                property: "list-style-position",
                //"values": "inside | outside |inherit",
                target: this.get('target')
            },
            {
                group: "Other",
                property: "list-style-type",
                //"values": "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none |inherit",
                target: this.get('target')
            },
            {
                group: "Other",
                property: "marker-offset",
                //"values": "",
                target: this.get('target')
            },
            {
                group: "Custom",
                property: "",
                //"values": "",
                target: this.get('target')
            }]
        ));

        this.get('items').on('change:isEditing', this._onEditing, this);
    },
    _onEditing: function(editItem) {
        if (editItem.get('isEditing')) {
            this.get('items').each(function(item) {
                if (item != editItem)
                    item.set('isEditing', false);
            });
        }
    },
    resetEdit: function() {
        this.get('items').each(function(item) {
            item.set('isEditing', false);
        });
    },
    complete: function() {
        this.get('items').each(function(item) { item.complete(); });
        this.set('lastAction', EditorOperationAction.complete);
    },
    cancel: function() {
        this.get('items').each(function(item) { item.cancel(); });
        this.set('lastAction', EditorOperationAction.cancel);
    },
    remove: function() {
        this.get('items').each(function(item) { item.remove(); });
        this.set('lastAction', EditorOperationAction.remove);
    },
    isOverriding: function(operation) {
        return false;
    }
});