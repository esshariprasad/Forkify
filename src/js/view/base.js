//all the query selector elements are present in this base.js

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results')
};


export const elementStrings = {
    loader: 'loader' //pasing the class name of loader
}

export const renderLoader = parent => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
        <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>

    `;
    console.log("HI");
    //right at the begining of parent element
    parent.insertAdjacentHTML('afterbegin',loader);

};

export const clearLoader = () =>{
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);

}

