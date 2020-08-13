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
                    $('.alert-danger').hide();
                    $('#uploadBtn').show();
                    $('#filesInput').val('');
                    $('.custom-file-label').html('Choose USDZ file');
                }, 2000);
            },

            success: function (response) {
                $('#url').attr('href', response.url).html(response.url);
                $('#qrcode').attr('src', response.img);
                $('#imgUrl').show();
                $('.spinner-border').hide();
                $('.alert-success').show();

                setTimeout(() => {
                    $('.alert-success').hide();
                    $('#uploadBtn').show();
                    $('#filesInput').val('');
                    $('.custom-file-label').html('Choose USDZ file');
                }, 2000);
            }
        });

        return false;
    });
});