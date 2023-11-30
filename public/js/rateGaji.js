function addRate(item) {
    let rate = parseInt(document.getElementById(item).value); //mengambil rate
    rate += 500;
    document.getElementById(item).value = rate; //menambahkan rate
}

function minRate(item) {
    let rate = parseInt(document.getElementById(item).value);
    rate -= 500;

    document.getElementById(item).value = rate;
}

document.getElementById('save').addEventListener('click', function () {
    document.getElementById('saveAlert').style.display = 'block';
});
