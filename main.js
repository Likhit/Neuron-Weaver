var Main = {};
$(function() {
    $("body").removeClass("hidden");
    
    {% include "templates/frontstage/frontstage.js" %}
    {% include "templates/frontstage/canvas.js" %}

    {% include "templates/frontstage/run/run.js" %}
    {% include "templates/frontstage/tools/tools.js" %}

    {% include "templates/frontstage/forms/set-weights-or-thresholds/set-weights-or-thresholds.js" %}
    {% include "templates/frontstage/forms/set-inputs/set-inputs.js" %}
    {% include "templates/frontstage/forms/set-training-data/set-training-data.js" %}

    {% include "templates/backstage/backstage.js" %}
});
