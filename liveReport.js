
let xTime;
let dataPoints1;
let dataPoints2;
let options;
let coinsSize;
let data;
let coinsDataPoints;
let coinsSymbol; // 'zoc,etr,btc'

function addData(data) {

    $.each(data, function (key, value) {
        const lowerKey = key.toLowerCase();
        coinsDataPoints[lowerKey].push({ x: xTime, y: value.USD})
    });


    if ($("#chartContainer").length > 0) {
        $("#chartContainer").CanvasJSChart().render()
        setTimeout(updateData, 2000);
    }
}

function updateData() {

    xTime = xTime + 2;
 
    $.getJSON(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsSymbol}&tsyms=USD`,
        addData);

}

const loadLiveReport = () => {
    coinsSymbol = '';
    coinsDataPoints = {};
    coinsSize = fiveCoinList.length;

    if(coinsSize === 0) {
        $('#container').html('<div> Please choose at least one coin</div>');
        return;
    }
    data = [];

    
    let indexCoin = 0;
    for (; indexCoin < coinsSize - 1; indexCoin++) {
        coinsSymbol = coinsSymbol + fiveCoinList[indexCoin].symbol + ',';
    }
    coinsSymbol = coinsSymbol + fiveCoinList[indexCoin].symbol;


    for (let i = 0; i < coinsSize; i++) {
        const curSymbol = fiveCoinList[i].symbol;
        coinsDataPoints[curSymbol] = []; // מערך שנמלא בנקודות
        const curCoinDataSet = {
            type: "line",
            name: curSymbol,
            showInLegend: true,
            dataPoints: coinsDataPoints[curSymbol] // pointer מצביע לאותו מערך
        }
        data.push(curCoinDataSet)
    }

    options = {
        theme: "light2",
        axisY: {
            title: "Coin Value",
        },
        title: {
            text: coinsSymbol + ' to USD'
        },
        legend:{
            cursor:"pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
        },
        data
    };
    $('#container').html('<div id="chartContainer" style="height: 370px; width: 100%;"></div>');
    $("#chartContainer").CanvasJSChart(options);

    xTime = 0;
    updateData(coinsSymbol);

}