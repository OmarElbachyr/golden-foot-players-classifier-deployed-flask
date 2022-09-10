Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone('#dropzone', {
        url: '/',
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: 'Some Message',
        autoProcessQueue: false,
    });

    dz.on('addedfile', function () {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);
        }
    });

    $('#submitBtn').on('click', function (e) {
        dz.processQueue();
    });

    dz.on('complete', function (file) {
        let imageData = file.dataURL;

        let url = 'http://127.0.0.1:5000/classify_image';

        $.post(url, { image_data: imageData }, function (data) {
            if (!data || data.length == 0) {
                $('#resultHolder').hide();
                $('#divClassTable').hide();
                $('#error').show();
                return;
            }

            let match = null;
            let bestScore = -1;

            for (let i = 0; i < data.length; ++i) {
                let currentMaxScore = Math.max(...data[i].class_probability);
                if (currentMaxScore > bestScore) {
                    match = data[i];
                    bestScore = currentMaxScore;
                }
            }

            if (match) {
                $('#error').hide();
                $('#resultHolder').show();

                $('#resultHolder').html(
                    $(`[data-player="${match.class}"`).html()
                );

                document
                    .querySelector('#resultHolder')
                    .childNodes[1].childNodes[1].classList.replace(
                        'custom-circle-image',
                        'custom-circle-image-result'
                    );
            }

            document.querySelector('.dz-error-message').remove();
            document.querySelector('.dz-error-mark').remove();
        });
    });
}

$(document).ready(function () {
    console.log('ready!');
    $('#error').hide();
    $('#resultHolder').hide();
    $('#divClassTable').hide();

    init();
});
