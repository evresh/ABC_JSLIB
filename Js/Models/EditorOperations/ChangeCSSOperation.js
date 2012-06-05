var ChangeCSSOperation = Backbone.Model.extend({
    defaults: {
        lastAction: EditorOperationAction.none,
        isEditing: false
    },
    initialize: function() {
        var styleItems = Backbone.Collection.extend({ model: StyleItemOperation });
        this.set('items', new styleItems([
            new StyleItemOperation({
                group: "Text",
                property: "font-family",
                //"values": "[ [<family-name>|<generic-family>] [,<family-name>|<generic-family>]* ] |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "font-size",
                //"values": "<absolute-size>|<relative-size>|<length>|<percentage>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "font-weight",
                //"values": "normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "font-style",
                //"values": "normal | italic | oblique |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "font-size-adjust",
                //"values": "",
                target: this.get('target')
            }),
            new ColorItemOperation({
                group: "Text",
                property: "color",
                //"values": "<color>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "text-transform",
                //"values": "capitalize | uppercase | lowercase | none |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "text-decoration",
                //"values": "none | [ underline || overline || line-through || blink ] |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "letter-spacing",
                //"values": "normal |<length>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "word-spacing",
                //"values": "normal |<length>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "line-height",
                //"values": "normal |<number>|<length>|<percentage>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "text-align",
                //"values": "left | right | center | justify |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "vertical-align",
                //"values": "baseline | sub | super | top | text-top | middle | bottom | text-bottom |<percentage>|<length>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Text",
                property: "direction",
                //"values": "ltr | rtl |inherit",
                target: this.get('target')
            }),
            new ColorItemOperation({
                group: "Background",
                property: "background-color",
                //"values": "<color>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Background",
                property: "background-image",
                //"values": "<uri>| none |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Background",
                property: "background-repeat",
                //"values": "repeat | repeat-x | repeat-y | no-repeat |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Background",
                property: "background-position",
                //"values": "[ [<percentage>|<length>| left | center | right ] [<percentage>|<length>| top | center | bottom ]? ] | [ [ left | center | right ] || [ top | center | bottom ] ] |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Background",
                property: "background-attachment",
                //"values": "scroll | fixed |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Background",
                property: "opacity",
                //"values": "<number>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "width",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "height",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "top",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "right",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "bottom",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "left",
                //"values": "<length>|<percentage>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "margin-top",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "margin-right",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "margin-bottom",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "margin-left",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "padding-top",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "padding-right",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "padding-bottom",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "padding-left",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Dimensions",
                property: "box-shadow",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-top-width",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-right-width",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-bottom-width",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-left-width",
                //"values": "",
                target: this.get('target')
            }),
            new ColorItemOperation({
                group: "Border",
                property: "border-top-color",
                //"values": "",
                target: this.get('target')
            }),
            new ColorItemOperation({
                group: "Border",
                property: "border-right-color",
                //"values": "",
                target: this.get('target')
            }),
            new ColorItemOperation({
                group: "Border",
                property: "border-bottom-color",
                //"values": "",
                target: this.get('target')
            }),
            new ColorItemOperation({
                group: "Border",
                property: "border-left-color",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-top-style",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-right-style",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-bottom-style",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Border",
                property: "border-left-style",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "position",
                //"values": "static | relative | absolute | fixed |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "display",
                //"values": "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | none |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "visibility",
                //"values": "visible | hidden | collapse |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "z-index",
                //"values": "auto |<integer>|inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "overflow-x",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "overflow-y",
                //"values": "",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "white-space",
                //"values": "normal | pre | nowrap | pre-wrap | pre-line |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "clip",
                //"values": "<shape>| auto |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "float",
                //"values": "left | right | none |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Layout",
                property: "clear",
                //"values": "none | left | right | both |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Other",
                property: "cursor",
                //"values": "[ [<uri>,]* [ auto | crosshair | default | pointer | move | e-resize | ne-resize | nw-resize | n-resize | se-resize | sw-resize | s-resize | w-resize | text | wait | help | progress ] ] |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Other",
                property: "list-style-image",
                //"values": "<uri>| none |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Other",
                property: "list-style-position",
                //"values": "inside | outside |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Other",
                property: "list-style-type",
                //"values": "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none |inherit",
                target: this.get('target')
            }),
            new StyleItemOperation({
                group: "Other",
                property: "marker-offset",
                //"values": "",
                target: this.get('target')
            })
            ]
        ));
        this.set('tempItems', new Backbone.Collection());

        this.on('change:isEditing', this._onEditing, this);
        this.get('tempItems').on('change:isEditing', this._onItemEditing, this);
        this.get('tempItems').on('action', this._onItemAction, this);
    },
    _onEditing: function() {
        if (this.get('isEditing')) {
            var tempItems = this.get('tempItems');
            tempItems.reset();
            this.get('items').each(_.bind(function(item) {
                tempItems.add(this._createTempItem(item));
            }, this))
        }
    },
    _onItemEditing: function(editItem) {
        if (editItem.get('isEditing')) {
            this.get('tempItems').each(function(item) {
                if (item != editItem)
                    item.set('isEditing', false);
            });
        }
    },
    _onItemAction: function(actionItem) {
        var isCompleted = actionItem.get('lastAction') == EditorOperationAction.complete;
        if (isCompleted) {
            var existentNewItems = this.get('tempItems').select(function(item) {
                return item != actionItem
                    && item.get('isNew')
                    && item.get('property') == actionItem.get('property');
            });

            $.each(existentNewItems, function(i, item) { item.synchronizeState(); });
        }
    },
    _createTempItem: function(item) {
        if (item.get('isNew'))
            return item;

        var attrs = {
            initialState: item.isCustom() ? item.get('initialState') : item.getValue(),
            changedState: item.getValue(),
            target: item.get('target'),
            source: item,
            group: item.get('group'),
            property: item.get('property')
        };

        if (item instanceof ColorItemOperation)
            return new ColorItemOperation(attrs);

        return new StyleItemOperation(attrs);
    },
    resetEdit: function() {
        this.get('tempItems').each(function(item) {
            item.set('isEditing', false);
        });
    },
    complete: function() {
        var items = this.get('items');
        this.get('tempItems').each(function(item) {
            var sourceItem = item.get('source');
            var changedState = item.get('changedState');
            var isRemoved = item.get('lastAction') == EditorOperationAction.remove;
            if (sourceItem) {
                if (!item.get('isNew')) {
                    sourceItem.set('changedState', changedState);
                    sourceItem.complete();
                    item.remove();
                } else if (item.isCustom() && isRemoved) {
                    sourceItem.remove();
                    items.remove(sourceItem);
                }
            } else if (item.isCustom() && !isRemoved) {
                items.add(item);
            }
        });

        this.set('lastAction', EditorOperationAction.complete);
        this.set('isEditing', false);
    },
    cancel: function() {
        this.get('tempItems').each(function(item) {
            item.remove();
            var sourceItem = item.get('source');
        });
        this.set('lastAction', EditorOperationAction.cancel);
        this.set('isEditing', false);
    },
    remove: function() {
        this.get('items').each(function(item) { item.remove(); });
        this.set('lastAction', EditorOperationAction.remove);
        this.set('isEditing', false);
    },
    isOverriding: function(operation) {
        return false;
    },
    createCustomItem: function() {
        var model = new StyleItemOperation({
            group: 'Custom',
            target: this.get('target')
        });
        this.get('tempItems').add(model);
        return model;
    }
});