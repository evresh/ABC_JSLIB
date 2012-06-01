var EditView = OperationView.extend({
    maximizable: true,
    events: function() {
        return $.extend({}, OperationView.prototype.events, {
            'click .editHTMLButton': '_editHTML'
        });
    },
    _afterRender: function() {
        this._overlay.setTitle('Edit');

        var _this = this;

        var styles = this.options.frame.getDocument()[0].styleSheets;
        var css = [];
        $.each(styles, function() {
            if (!!this.href)
                css.push(this.href);
        });

        tinymce.settings = {
            mode: 'none',
            theme: 'advanced',
            remove_linebreaks: false,
            plugins: 'autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,inlinepopups,media,searchreplace,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template',
            theme_advanced_buttons1: 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,outdent,indent,bullist,numlist,|,forecolor,backcolor,styleprops,|,undo,redo',
            theme_advanced_buttons2: 'link,unlink,image,media,|,preview,code,|,formatselect,|,fontselect,|,fontsizeselect',
            theme_advanced_buttons3: '',
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            theme_advanced_statusbar_location: false,
            theme_advanced_resizing: false,
            convert_urls: false,
            forced_root_block: '',
            width: "100%",
            height: "100%",
            accessibility_warnings: false,
            //file_browser_callback: 'tinyBrowser',
            relative_urls: false,
            remove_script_host: false,
            verify_html: true,
            entities: '38,amp,34,quot,60,lt,62,gt',
            //document_base_url: this.frame.vwo_document_real_url,
            content_css: css.join(','),
            valid_children: '+body[style|tbody|thead|tr|label|td|dd|li|p|ol|ul|hr]',
            valid_elements: '*[*]',
            setup: function(editor) {
                editor.onInit.add(function(e) {
                    _this._editor = e;
                    _this._reset();
                });
                editor.onKeyUp.add(function(e) {
                    _this.model.apply(_this._editor.getContent());
                });
                editor.onExecCommand.add(function(e) {
                    _this.model.apply(_this._editor.getContent());
                });
            }
        };
        tinymce.execCommand('mceAddControl', true, "editOp");
    },
    _reset: function() {
        if (this._editor) {
            this._editor.setContent(this.model.getValue());
            this._editor.focus();
        }
    },
    _editHTML: function() {
        this.model.switchTo('editHTML');
    },
    _toggleMaximizing: function(info) {
        var container = this.$('.editContainer');
        var elements = this.$('.editContainer,#tiny_tbl,#tiny_ifr');
        if (info.maximized) {
            container.attr('actualHeight', container.height()).attr('actualWidth', container.width());
            elements.css('height', info.availableHeight);
        } else if (container.attr('actualHeight')) {
            elements.css('height', container.attr('actualHeight')).css('width', container.attr('actualWidth'));
        }
        elements.toggleClass('maximized', info.maximized);
    }
})