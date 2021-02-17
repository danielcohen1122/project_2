
const showProgress = ()=>  {
    $('.progress').removeClass('hidden')
}

const hideProgress = () => {
    if($('progrees').hasClass('hidden') === false) {
        $('.progress').addClass('hidden')
  }
}