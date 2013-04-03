var Main = {};
$(function() {
    $("body").removeClass("hidden");
    
    {% include "templates/frontstage/frontstage.js" %}

    {% include "templates/backstage/backstage.js" %}
});
