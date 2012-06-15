var EditorTargetMode = {
    none: 0,
    editing: 1,
    resize: 2,
    move: 3
}

var EditorTarget = Backbone.Model.extend({
    defaults: {
        editMode: EditorTargetMode.none,
        element: null,
        pageX: null,
        pageY: null
    },
    getDocument: function() {
        return $(this.get('element')[0].ownerDocument);
    },
    getParentIframe: function() {
        var result = null;
        var doc = this.getDocument();
        $('iframe').each(function(i, iframe) {
            if ((iframe.contentDocument || iframe.contentWindow.document) == doc[0]) {
                result = $(iframe);
                return false;
            }
        });

        return result;
    },
    edited: function(sender) {
        this.trigger('edited', sender);
    },
    updated: function(sender) {
        this.trigger('updated', sender);
    },
    edit: function(mode) {
        this.set('editMode', mode || EditorTargetMode.editing);
    },
    stopEdit: function() {
        this.set('editMode', EditorTargetMode.none);
    }
})