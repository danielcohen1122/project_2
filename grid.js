let i = 0;
let coin_arr;
let coin_arr_origin;

const getCoinsContent = () => {
  $('#container').empty();
  // $('#container').append(i++)
  GetDataFromAPI();

}


const draw_coincard = () => {

  let cards = '';
  for (let i = 0; i < coin_arr.length; i++) {
    cards = cards +
      `<div class="card">
                            <div class="card-body">
                            <h5 class="card-title">${coin_arr[i].symbol}</h5>
                            <label class="switch">
  <input id="checkbox-${coin_arr[i].id}" type="checkbox" onchange="onToggleClick('${coin_arr[i].id}', '${coin_arr[i].symbol}')">
  <span class="slider round"></span>
</label>
                            <p class="card-text">${coin_arr[i].name}</p>
                            
                  
                        
                          </p>
                          <p>
                         
                          <button onclick="moreinfo('${coin_arr[i].id}', ${i})" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample">
                          MORE INFO
                          </button>
                        </p>
                        <div class="collapse" id="collapseExample${i}">
                          <div class="card card-body">
                          <img/>
                          <div>USD:<span class="usd"></span>$</div>
                           <BR>
                         
                           
                          <div> ERUO:<span class="eur"></span>€</div>
                          </div>


                        </div>

                        </div>
                        </div>`;

  }
  $('#container').html(cards);

  turnOnSavedCoinsIfExists();
  hideProgress()
}

const turnOnSavedCoinsIfExists = () => {

  for (let i = 0; i < fiveCoinList.length; i++) {
    $('#checkbox-' + fiveCoinList[i].id).prop('checked', true);
  }
}

const searchCoin = () => {

  const searchVal = $('#searchInput').val();

  if (searchVal === null || searchVal === undefined || searchVal === '') {
    coin_arr = coin_arr_origin;
    draw_coincard();
  } else {
    const foundCoin = coin_arr.find((coin) => {
      return coin.symbol === searchVal
    });

    console.log(foundCoin)

    if (foundCoin === undefined) {
      coin_arr = [];
    } else {
      coin_arr = [foundCoin]
    }

    draw_coincard();

  }

}