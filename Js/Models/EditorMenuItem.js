var EditorMenuItem = Backbone.Model.extend({
    defaults: {
        name: '',
        type: null,
        targetElement: null,
        isVisible: false
    },
    update: function() {
        var isVisible, targetElement = this.get('targetElement'), tagName = targetElement.get(0).tagName;

        switch(this.get('type')) {
            case 'selectParent':
                isVisible = tagName != 'body' && targetElement.parent()[0].tagName.toLowerCase() != 'body';
                break;
            case 'edit':
                isVisible = tagName != 'IMG';
                break;
            case 'visibility':
                this.set('name', VisibilityOperation.isTargetElementHidden(targetElement) ? 'Show' : 'Hide');
                isVisible = true;
                break;
            case 'changeText':
                isVisible = targetElement.children().length == 0 && tagName != 'IMG' && tagName != 'INPUT';
                break;
            case 'changeImage':
                isVisible = tagName == 'IMG';
                break;
            default:
                isVisible = true;
                break;
        }

        this.set('isVisible', isVisible);
    },
    perform: function() {
        this.trigger('perform', this);
    }
});