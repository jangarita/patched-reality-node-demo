'use strict';

$(function () {
    $('#filesInput').on('change', () => {
        const input = $('#filesInput');
        const fileList = input.prop('files');
        const isValid = fileList.length > 0 && fileList[0].name.split('.').pop().toLowerCase() === 'usdz';

        input.next('.custom-file-label').html(isValid
            ? fileList[0].name + ' [' + (fileList[0].size / 1024 / 1024).toFixed(2).toLocaleString() + ' MB]'
            : 'Choose USDZ file');

        $('#uploadBtn').enable(isValid);
    });

    $('#uploadForm').on('submit', function () {
        $('.spinner-border').show();
        $('#uploadBtn').enable(false).hide();
        $('.alert-success').hide();
        $('.alert-danger').hide();

        $(this).ajaxSubmit({
            error: function (xhr) {
                $('.spinner-border').hide();
                $('.alert-danger').show();

                setTimeout(() => {
                    readyToUpload();
                }, 2000);
            },

            success: function (response) {
                uploads = response.uploads;
                listUploads();

                $('.spinner-border').hide();
                $('.alert-success').show();

                setTimeout(() => {
                    readyToUpload();
                }, 2000);
            }
        });

        $('#filesInput').enable(false);

        return false;
    });

    function readyToUpload() {
        $('.alert-danger').hide();
        $('.alert-success').hide();
        $('#uploadBtn').show();
        $('#filesInput').enable(true).val('');
        $('.custom-file-label').html('Choose USDZ file');
    }

    function listUploads() {
        const ul = $('#imgUrl ul');

        ul.empty();

        uploads.forEach(element => {
            ul.append(`<li class="list-group-item">
                    <button type="button" class="qrBtn btn btn-info mr-3"
                        data-toggle="modal" data-target="#qrModal" data-qr="${element}">QR</button>
                    <a href="${element}" target="_blank">${element}</a>
                </li>`);

            $('.qrBtn').off('click');

            $('.qrBtn').on('click', function () {
                QRCode.toDataURL($(this).data('qr'), (err, img) => {
                    $('#qrImg').attr('src', img);
                });
            });
        });
    }

    listUploads();
});
