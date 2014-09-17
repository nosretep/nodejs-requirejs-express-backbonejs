define(['underscore', 'backbone', 'views/proto', 'text!templates/home.html'],
    function (_, Backbone, ProtoView, homeViewTemplate) {
        return ProtoView.extend({
        	title: 'Home',
        	className: 'home_content',
            template: _.template(homeViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);