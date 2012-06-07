var EditorTargetMode = {
    none: 0,
    resizing: 1
}

var EditorTarget = Backbone.Model.extend({
    defaults: {
        mode: EditorTargetMode.none,
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
    updated: function(initiator) {
        this.trigger('updated', initiator);
    }
})