/* Rachna Poonit - 8959611 */
"use strict";

const form = document.querySelector('#contact-us-form'); // get form element using plain jQuery
const nameElement = document.querySelector('#name');
const emailElement = document.querySelector('#email');
const commentElement = document.querySelector('#comment');
const availabilityElement = document.querySelector('#datepicker');

$(document).ready(() => {
    // JQuery Datepicker UI widget with options
    $("#datepicker").datepicker({
        minDate: new Date(), // minimum date to input is as from today
        showButtonPanel: true
    });

    // Event for submitting to form
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        // Validation of fields
        let isValid = false;

        // Error message
        const errMsg = document.querySelector('#errMsg');
        errMsg.innerHTML = "";

        // Get form data values
        const inputName = nameElement.value.trim(); // trim removes whitespace
        const inputEmail = emailElement.value.trim();
        const inputComment = commentElement.value.trim();

        // check mandatory fields
        if (!inputName || !inputEmail || !inputComment) {
            errMsg.innerHTML = "Please fill out mandatory fields to submit.";
        }
        else {
            isValid = true;
        }

        // Submit information and update display
        if (isValid) {
            //  JQuery button and dialog widget
            $("#contact-success-dialog").dialog({ modal:true });

            form.reset();
            
        }
    });

    // Reset form event
    form.addEventListener('reset', (evt) => {
        // Clear error message
        errMsg.innerHTML = "";
    });

    // Focus on first name element on load
    $("#name").focus();
});