const cards = [
    "54:15:06:b7",
    "04:5a:3a:32:0a:54:80",
    "83:f7:ef:c4",
    "33:a4:3c:c5",
    "73:32:2b:c5",
    "13:3e:cc:c4",
    "23:d4:d3:c4",
    "b3:ae:40:a8"
];

let timer = null;

function log(msg) {
    $("#logContainer").prepend("<p>" + msg + "<p>");
}

function showAccessSuccess(show) {
    if (show) {
        hideAllAccessContainers();
        $("#accessSuccess").show();
    } else {
        $("#accessSuccess").hide();
    }
}

function showAccessError(show) {
    if (show) {
        hideAllAccessContainers();
        $("#accessError").show();
    } else {
        $("#accessError").hide();
    }
}

function showAccessLoading(show) {
    if (show) {
        hideAllAccessContainers();
        $("#accessLoading").show();
    } else {
        $("#accessLoading").hide();
    }
}

function showStartContainer(show) {
    if (show) {
        $("#startContainer").show();
    } else {
        $("#startContainer").hide();
    }
}

function showMainContainer(show) {
    if (show) {
        $("#mainContainer").show();
    } else {
        $("#mainContainer").hide();
    }
}

function hideAllAccessContainers() {
    showAccessSuccess(false);
    showAccessError(false);
    showAccessLoading(false);
}

async function startScan() {
    showAccessLoading(true);

    try {
        const ndef = new NDEFReader();
        await ndef.scan();

        log("> Scan started");

        showStartContainer(false);
        showMainContainer(true);

        ndef.addEventListener("readingerror", () => {
            log("Argh! Cannot read data from the NFC tag. Try another one?");
        });

        ndef.addEventListener("reading", ({ message, serialNumber }) => {
            log(`> Serial Number: ${serialNumber}`);
            //log(`> Records: (${message.records.length})`);

            if (cards.includes(serialNumber)) {
                showAccessSuccess(true);
            } else {
                showAccessError(true);
            }

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(showAccessLoading, 5000, true);
        });
    } catch (error) {
        log("Argh! " + error);
    }
}

$(document).ready(function () {
    //
});
