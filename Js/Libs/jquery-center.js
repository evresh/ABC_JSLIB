jQuery.fn.center = function(params) {
    var options = {
        vertical: true,
        horizontal: true
    }
    var op = jQuery.extend(options, params);
    return this.each(function() {
        var $self = jQuery(this);
        var width = $self.outerWidth();
        var height = $self.outerHeight();
        $self.css("position", "absolute");
        if (op.vertical) {
            $self.css("top", '50%');
            $self.css("marginTop", -height / 2);
        }
        if (op.horizontal) {
            $self.css("left", '50%');
            $self.css("marginLeft", -width / 2);
        }
    });
};;