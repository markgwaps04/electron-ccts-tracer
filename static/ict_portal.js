const electron = require("electron");
const ipc = electron.ipcRenderer;


(function (jq) {

    jq("form#tracker").submit(function (e) {

        const overlay_spinner = jq(".main_container .overlay-spinner")

        e.preventDefault();

        const form = jq(this);
        const data = form.serialize_form();

        const validation = form.parsley();
        validation.validate({force: true});

        const is_valid = validation.isValid();
        if (!is_valid) return e.preventDefault();
        overlay_spinner.addClass("show");

        ipc.send("trace_email", data);

        ipc.on("trace_email_done", function (event, arg) {
            overlay_spinner.removeClass("show");
        });

    });

})(jQuery);

