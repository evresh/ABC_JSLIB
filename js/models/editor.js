var Editor = Backbone.Model.extend({
    initialize: function() {
        this.set('testPage', new TestPage({ pageUrl: this.get('pageUrl') }));
        this.get('testPage').on('change:isSelected', this._targetSelected, this);
    },
    _targetSelected: function() {
        if (this.get('testPage').get('isSelected'))
            alert('Open editor menu: not implented yet');
    },
    save: function() {
        alert('Saving changes: not implemented yet');
    }
})