/* Rachna Poonit - 8959611 */
"use strict";

$(document).ready(() => {

    // jQuery for accordion
    $("#about-accordion").accordion({ 
        event: "click",
        heightStyle: "content",
        collapsible: true 
    });

    // Call to the bxSlider function
    $("#slider").bxSlider({
        auto: true,
        autoControls: true,
        captions: true,
        minSlides: 2,
        maxSlides: 2,
        slideWidth: 250,
        slideMargin: 10
    });
});