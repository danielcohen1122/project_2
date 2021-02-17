
const GetDataFromAPI = async () => {
    try {

        $('.progress').removeClass('hidden')


        // get the data from the api 
        let response = await fetch('https://api.coingecko.com/api/v3/coins/list')

        let data_json = await response.json();
        data_json = data_json.splice(0, 12)
        coin_arr = data_json;
        coin_arr_origin = data_json;
        draw_coincard();
    }
    catch (e) {
        console.log(e)
    }
};



const moreinfo = async (id, i) => {

    try {

        let img;
        let euroPrice;
        let usdPrice;

/*
 מגירה 1- גרביים ומכנס
 מגירה 2- חולצה
 מגירה 17 - 


*/

        // לקבל את המידע מהלוקאל סטורג
        const savedData = localStorage.getItem(id);

        let dataIsFresh;

        // תבדוק אם קיים מידע שמור עבור המזהה הנדרש
        const haveSaveData = savedData !== null && savedData !== undefined;
        if (haveSaveData === true) {
            const data = JSON.parse(savedData)

            const savedTime = data.timeOfSave;
            console.log('savedTime')
            console.log(savedTime)

            const twoMin = 1000 * 60 * 2;
            const now = Date.now();

            if (now > twoMin + savedTime) { // 19:05 > 2 + 19:02
                dataIsFresh = false;
            } else {
                dataIsFresh = true;
            }

        }

        if (haveSaveData === true && dataIsFresh === true) {

            // תשתמש במידע שכבר יש לך, זה ששמרת מקודם
            const data = JSON.parse(savedData)
            img = data.img;
            euroPrice = data.euroPrice;
            usdPrice = data.usdPrice;
            console.log('used existing')
        } else {

            // תביא את המידע בפעם הראשונה או מידע רענן
            showProgress()
            console.log('call api')
            // get the data from the api 
            let response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)

            let data_json = await response.json();

            img = data_json.image.small;
            euroPrice = data_json.market_data.current_price.eur;
            usdPrice = data_json.market_data.current_price.usd;

            const timeOfSave = Date.now();

            const toSave = {
                img: img,
                euroPrice: euroPrice,
                usdPrice: usdPrice,
                timeOfSave: timeOfSave
            };
            const toSaveAsString = JSON.stringify(toSave)
            localStorage.setItem(id, toSaveAsString);

        }

        $(`#collapseExample${i} .usd`).html(usdPrice); // '#collapseExample1 .usd'
        $(`#collapseExample${i} .eur`).html(euroPrice); // '#collapseExample1 .usd'
        $(`#collapseExample${i} img`).attr('src', img); // '#collapseExample1 .usd'

        hideProgress()

    } catch (e) {
        console.log(e)
    }
}

