$(document).ready(function () {
    // inisiasi API url
    var _url = 'https://my-json-server.typicode.com/techtona/belajar-api/mahasiswa';

    // untuk menampung data semua mahasiswa
    var result = '';

    // untuk menampung gender sbg option di select
    var gender_result = '';
    // untuk menampung gender semua mahasiswa
    var gender = [];


    $.get(_url,function (data) {
        $.each(data, function (key, items) {
            _gend = items.gender;

            result += '<div>' +
                '<h3>'+items.name+'</h3>' +
                '<p>'+_gend+'</p>' +
                '</div>';

            if ($.inArray(_gend, gender) === -1){
                gender.push(_gend);
                gender_result += "<option value='"+_gend+"'>"+_gend+"</option>";
            }

        });

        $('#mhs-list').html(result);
        $('#mhs-select').html(gender_result);
    });
});