
const fiveCoinList = []; // ['dsfvsfdv', 'id2'] => [ {id: 'asdsd', sybol: 'asdc'}, ]

let editToggles;

const onToggleClick = (id, symbol) => {

    let shouldAddToList = $('#checkbox-' + id).is(':checked');

    if (shouldAddToList === true) {

        if (fiveCoinList.length < 5) {

            fiveCoinList.push({ id, symbol });
        } else {

            $('#checkbox-' + id).prop('checked', false);
            popModal();

        }
    } else {
        remove(id);
    }

}


const onModalToggleClick = (id, symbol) => {

    let shouldAddToList = $('#modal-checkbox-' + id).is(':checked');
    if (shouldAddToList === true) {
        editToggles.push({ id, symbol });
    } else {
        removeFromEditToggles(id);
    }
}

const removeFromEditToggles = (id) => {
    const index = editToggles.findIndex(coin => coin.id === id);
    const isExist = index > -1;
    if (isExist) {
        editToggles.splice(index, 1)
    }
}

const remove = (id) => {
    const index = fiveCoinList.findIndex(coin => coin.id === id);
    const isExist = index > -1;
    if (isExist) {
        fiveCoinList.splice(index, 1)
    }
    $('#checkbox-' + id).prop('checked', false);
}

const popModal = () => {

    editToggles = [];

    for (let i = 0; i <= 4; i++) {

        editToggles.push(JSON.parse(JSON.stringify(fiveCoinList[i])));

        const coinElement = `${fiveCoinList[i].id}
        <label class="switch">
        <input id="modal-checkbox-${fiveCoinList[i].id}" 
        type="checkbox"
        onchange="onModalToggleClick('${fiveCoinList[i].id}', '${fiveCoinList[i].symbol}')" checked>
        <span class="slider round"></span>
      </label>`
        $(`#coin-${i}`).html(coinElement)
    }


    $('#myModal').modal('show');

}


const saveChanges = () => {
    // כל המזהים שלא נמצאים ב editToggles
    // צריך להסיר מהמערך הראשי
    keepExistingKeysInEdited();
    $('#myModal').modal('hide');
}
// $('#myModal').modal('show');
// $('#myModal').modal('hide');

const keepExistingKeysInEdited = () => {
    console.log(JSON.parse(JSON.stringify(fiveCoinList)))
    console.log(JSON.parse(JSON.stringify(editToggles)))
    const idsToRemove = [];

    for (let i = 0; i < fiveCoinList.length; i++) {
        const foundIndex = editToggles.findIndex(coin => coin.id === fiveCoinList[i].id);
        console.log(foundIndex)
        if (foundIndex === -1) {
            console.log('remove - ' + fiveCoinList[i].id)
            idsToRemove.push(fiveCoinList[i].id);
        }
    }

    for (let i = 0; i < idsToRemove.length; i++) {
        remove(idsToRemove[i])
    }
}
