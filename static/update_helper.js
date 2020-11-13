const electron = require("electron");
const ipc = electron.ipcRenderer;

(function(jq) {

    const download_app_release = document.getElementById("download_app_release");
    download_app_release.addEventListener("click" , function () {
        ipc.send("access_download_new_release");
        const spinner = jq(".main_container .overlay-spinner");
        spinner.addClass("show");
    })

})(jQuery)