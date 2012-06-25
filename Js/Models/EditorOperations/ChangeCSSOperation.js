var ChangeCSSOperation = Backbone.Model.extend({
    defaults: {
        lastAction: EditorOperationAction.none,
        isEditing: false
    },
    _groups: {
        Text: [ 'font-family', 'font-size', 'font-weight', 'font-style', 'font-size-adjust', 'color', 'text-transform',
            'text-decoration', 'letter-spacing', 'word-spacing', 'line-height', 'text-align', 'vertical-align', 'direction' ],
        Background: [ 'background-color', 'background-image', 'background-repeat', 'background-position', 'background-attachment',
            'opacity' ],
        Dimensions: [ 'width', 'height', 'top', 'right', 'bottom', 'left', 'margin-top', 'margin-right', 'margin-bottom',
            'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'box-shadow' ],
        Border: [ 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-color',
            'border-right-color', 'border-bottom-color', 'border-left-color', 'border-top-style', 'border-right-style', 'border-bottom-style',
            'border-left-style' ],
        Layout: [ 'position', 'display', 'visibility', 'z-index', 'overflow-x', 'overflow-y', 'white-space', 'clip', 'float',
            'clear' ],
        Other: [ 'cursor', 'list-style-image', 'list-style-position', 'list-style-type', 'marker-offset' ]
    },
    initialize: function() {
        this.set('items', {});
        this.set('tempItems', new Backbone.Collection());

        this.get('tempItems')
            .on('change:isEditing', this._onItemEditing, this);
    },
    edit: function() {
        var tempItems = this.get('tempItems').reset();
        var items = this.get('items');
        var _this = this;

        $.each(this._groups, function(group, properties) {
            $.each(properties, function(i, property) {
                var attrs = {
                    property: property,
                    group: group,
                    target: _this.get('target'),
                    isTemp: true
                };
                var item = items[property];
                if (item)
                    attrs.initialState = attrs.changedState = item.getValue();

                var tempItem;
                if (property == 'color' || property == 'background-color' || property == 'border-top-color'
                    || property == 'border-right-color' || property == 'border-bottom-color' || property == 'border-left-color') {
                    tempItem = new ColorItemOperation(attrs);
                } else {
                    tempItem = new StyleItemOperation(attrs);
                }

                tempItems.add(tempItem);
            });
        });
        $.each(items, function(property, item) {
            if (item.isCustom())
                tempItems.add(new StyleItemOperation({
                    property: property,
                    group: item.get('group'),
                    target: item.get('target'),
                    isTemp: true,
                    initialState: item.get('initialState'),
                    changedState: item.getValue()
                }));
        });

        this.set('isEditing', true);
    },
    stopEdit: function() {
        this.get('tempItems').reset();
        this.set('isEditing', false);
    },
    _onItemEditing: function(editItem) {
        if (editItem.get('isEditing')) {
            this.get('tempItems').each(function(item) {
                if (item != editItem)
                    item.stopEdit();
            });
        }
    },
    resetEdit: function() {
        this.get('tempItems').each(function(item) {
            item.stopEdit();
        });
    },
    complete: function() {
        var items = this.get('items');
        var _this = this;
        this.get('tempItems').each(function(tempItem) {
            if (!tempItem.get('isNew')) {
                var sourceItem = items[tempItem.get('property')];
                var changedState = tempItem.get('changedState');
                var isRemoved = tempItem.get('lastAction') == EditorOperationAction.remove;
                if (sourceItem) {
                    if (tempItem.isCustom() && isRemoved && sourceItem.isCustom()) {
                        sourceItem.remove();
                        delete items[tempItem.get('property')];
                    } else if (!isRemoved) {
                        tempItem.remove();
                        sourceItem.apply(changedState);
                        sourceItem.complete();
                    }
                } else if (!isRemoved) {
                    items[tempItem.get('property')] = tempItem.unset('isTemp');

                    var itemRegularGroup;
                    $.each(_this._groups, function(group, properties) {
                        $.each(properties, function(i, property) {
                            if (property == tempItem.get('property')) {
                                itemRegularGroup = group;
                                return false;
                            }
                        });
                        if (itemRegularGroup)
                            return false;
                    });
                    if (itemRegularGroup)
                        tempItem.set('group', itemRegularGroup);

                    tempItem.complete(); // to notify about changes other external operations
                }
            } else {
                tempItem.remove();
                var sourceItem = items[tempItem.get('property')];
                if (sourceItem && tempItem.isCustom())
                    sourceItem.apply(sourceItem.getValue());
            }
        });

        this.get('target').edited(this);

        this.set('lastAction', EditorOperationAction.complete);
        this.stopEdit();
    },
    cancel: function() {
        var items = this.get('items');
        this.get('tempItems').each(function(tempItem) {
            tempItem.remove();
            var sourceItem = items[tempItem.get('property')];
            if (sourceItem && tempItem.isCustom())
                sourceItem.apply(sourceItem.getValue());
        });

        this.get('target').edited(this);

        this.set('lastAction', EditorOperationAction.cancel);
        this.stopEdit();
    },
    remove: function() {
        var items = this.get('items');
        $.each(this.get('items'), function(property, item) {
            item.remove();
            delete items[property];
        });

        this.get('target').edited(this);

        this.set('lastAction', EditorOperationAction.remove);
        this.stopEdit();
    },
    isOverriding: function(operation) {
        return false;
    },
    createCustomItem: function() {
        var model = new StyleItemOperation({
            group: 'Custom',
            target: this.get('target'),
            isTemp: true
        });
        this.get('tempItems').add(model);
        return model;
    }
});