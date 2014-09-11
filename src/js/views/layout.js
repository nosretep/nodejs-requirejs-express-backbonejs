define([
        'underscore', 
        'backbone',
        'views/proto',
        'text!templates/layout.html'],
        function (_, Backbone, ProtoView, layoutViewTemplate) {
            return ProtoView.extend({
                template: _.template(layoutViewTemplate),
                render : function() {
                    this.$el.html(this.template());
                    return this;
                },
                setContent: function(view) {
                    this.removeChildViews();
                    this.addChildView(view);
                    
                    if (typeof document !== 'undefined') {
                    	document.title = view.getTitle();
                    };
                    
                    view.render();
                    this.$el.find('div#content').html('').append(view.el);
                }
            });
        }
    );