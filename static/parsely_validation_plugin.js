(function (w) {

    w.Parsley.addValidator('onlytext', {
        validateString: function (value) {
            const pattern = /[^a-zA-Z\-\/\s]/;
            return !pattern.test(value);
        },
        messages: {
            en: 'This value should be not have a special characters or numbers',
        }
    });

    w.Parsley.addValidator('onlynumbers', {
        validateString: function (value) {
            console.log("Gago");
            const that_value = Number(value);
            return !Number.isNaN(that_value);
        },
        messages: {
            en: 'This value should not have charaters included',
        }
    });

    w.Parsley.addValidator('fill_first', {
        validateString: function (value, require) {
           const $element = jQuery(require);
           const $element_value = String($element.val()).trim();
           const check1 = Boolean($element_value);
           const check2 = Boolean(String(value).trim());

           if(check1==false&&check2==false) return true;
           return check1 && check2;

        },
        messages: {
            en: 'This value should not have charaters included',
        }
    });

    w.Parsley.addValidator('nospaces', {
        validateString: function (value) {
            const pattern = /\s/;
            return !pattern.test(value);
        },
        messages: {
            en: 'This value should not have spaces included',
        }
    });

    w.Parsley.addValidator('date_is_before', {
        validateString: function (value, require, field) {
            const test = moment(value);
            const $require = jQuery(require);
            const require_value = $require.val();
            const require_valid = moment(require_value).isValid();
            if(!require_valid) return true;

            const test2 = moment(require_value);
            return test.isBefore(test2);

        },
        messages: {
            en: 'This value should before on the specified date',
        }
    });

    w.Parsley.addValidator('date_is_after', {
        validateString: function (value, require, field) {
            const test = moment(value);
            const $require = jQuery(require);
            const require_value = $require.val();
            const require_valid = moment(require_value).isValid();
            if(!require_valid) return true;

            const test2 = moment(require_value);
            return test.isAfter(test2);

        },
        messages: {
            en: 'This value should after on the specified date',
        }
    });


   w.Parsley.addAsyncValidator("check_username_exists", function (xhr) {

        if (404 === xhr.status) {
            r = $.parseJSON(xhr.responseText);
            this.addError("remote", {message: "This value seems not availlable"});
        }

        return 200 === xhr.status;

    }, '/account/check_username');


    w.Parsley.addAsyncValidator("check_date_batch", function (xhr) {

        if (404 === xhr.status) {
            r = $.parseJSON(xhr.responseText);
            this.addError("remote", {message: "This value seems not availlable"});
        }

        return 200 === xhr.status;

    }, '/school/batch/is_exists');

    w.Parsley.addAsyncValidator("check_student_key", function (xhr) {

        if (404 === xhr.status) {
            r = $.parseJSON(xhr.responseText);
            this.addError("remote", {message: "This value seems not availlable"});
        }

        return 200 === xhr.status;

    }, '/students/key-check');


    w.Parsley.addAsyncValidator("check_student_contact", function (xhr) {

        if (404 === xhr.status) {
            r = $.parseJSON(xhr.responseText);
            this.addError("remote", {message: "This value seems not availlable"});
        }

        return 200 === xhr.status;

    }, '/students/contact-check');

    const element = jQuery("form[data-parsley-validate].auto_validate");

    if(element.length)
    {
        const validation = element
            .parsley()
            .validate({force: true});
    }

    const force_validate = jQuery("form[data-parsley-validate].force_validate");

    console.log(force_validate);

    force_validate.submit(function(e) {
        const validation = force_validate
            .parsley()
            .validate({force: true});

        if (!validation) e.preventDefault();

    });

    // w.Parsley.addValidator('check_student_key', {
    //     validateString: function (value, requiremnet, field) {
    //
    //          const buttons =  field.parent.$element.find("[type=submit]");
    //
    //         return jQuery.ajax({
    //             url: '/students/key-check',
    //             method: "POST",
    //             headers: { "X-CSRFToken": $.cookie("csrftoken") },
    //             data : {value : value},
    //             beforeSend: function (xhr)
    //             {
    //
    //                 field.removeError('loading-spinner');
    //                 field.addError('loading-spinner', {
    //                     message: "<i class='icon-spinner icon-spin'></i>Please wait..."
    //                 });
    //
    //                buttons.attr("disabled","");
    //
    //             },
    //
    //             success : function()
    //             {
    //                 field.removeError('loading-spinner');
    //                 buttons.attr("disabled","");
    //             },
    //             error: function (result) {
    //                 document.write(result.responseText);
    //             }
    //         });
    //
    //     },
    //     messages: {
    //         en: 'This value is not availlable',
    //     }
    // });

})(window);
