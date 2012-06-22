var UserUploadedImages = Backbone.Collection.extend({
    fetch: function() {
        // until the server logic is ready, let's use the mimic code
        var data = [
            'http://' + document.location.host + '/img/tests/change-image.jpg',
            'http://' + document.location.host + '/img/tests/change-image-2.jpg',
            'http://' + document.location.host + '/img/tests/change-image-3.jpg'
        ];
        var _this = this;
        setTimeout(function() {
            _this.reset(_this.parse(data));
        }, 1500);
    },
    addImage: function(url) {
        this.add(new Backbone.Model({ src: url }));
    },
    parse: function(response) {
        var result = [];

        $.each(response, function(i, url) {
            result.push({ src: url });
        });

        return result;
    }
})