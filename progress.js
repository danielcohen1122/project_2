
const showProgress = ()=>  {
    $('.progress').removeClass('hidden')
}

const hideProgress = () => {
    if ($('.progress').hasClass('hidden') === false) {
        $('.progress').addClass('hidden')
    }
}