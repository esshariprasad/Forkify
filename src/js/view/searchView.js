//using named exports to export functions

import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { //we don't want implict return so we are using braces
    elements.searchInput.value='';
};

export const clearResults = () =>{
    elements.searchResList.innerHTML = ''; //removing previous results\
    elements.searchResPages.innerHTML='';
    
};

export const highlightSelected = id =>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
} 




export const limitRecipeTitle = (title,limit = 17) => {
    // 'pasta with tamato and spinach'
    // we split when characters are more than 17
    if(title.length > limit)
        {
            const newTitle = [];
            title.split(' ').reduce((acc,curr)=>{
                
                if(acc + curr.length <= limit){
                    newTitle.push(curr);
                    
                }
                
                return acc + curr.length;

            },0) 
            // /Reduce method: 1) callback function with acc and curr

            // 2)initial value of the accumulator/
        
            //joining the resulting array
            return `${newTitle.join(' ')}...`; 
            
        }
        return title;
}
const renderRecipe = recipe => {
    
    const markup = `
    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
    </li>
    `;
    
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//for prev for page 2 it gives 1 and for next gives 2
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page +1}>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
</svg>
<span>Page ${type === 'prev' ? page-1 : page +1}</span>
</button>
`;
const renderButtons = (page, numResults, resPerPage) =>{
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if( page === 1 && pages > 1)
    {
        button = createButton(page, 'next');
        //button to go to next page
    }
    else if( page < pages){
        //Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    else if (page == pages){
        //Only button to go to prev page
        button = createButton(page, 'prev');
    }
    //attaching the html
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};
export const renderResults = (recipes,page =1, resPerPage=10) => {
    const start = (page -1) *resPerPage;
    const end = page * resPerPage;
    //taking part of the results
    recipes.slice(start,end).forEach(renderRecipe);
    //for each result rendexRecipe is called
    // recipes.forEach(renderRecipe)

    //render Buttons with page,numResult,resperpage
    renderButtons(page, recipes.length,resPerPage);


};

//after getting results we render buttons