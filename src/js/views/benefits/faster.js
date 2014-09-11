define(['underscore', 'backbone', 'views/proto', 'text!templates/benefits/faster.html'],
    function (_, Backbone, ProtoView, fasterViewTemplate) {
        return ProtoView.extend({
            template: _.template(fasterViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);