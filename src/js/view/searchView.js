//using named exports to export functions

import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { //we don't want implict return so we are using braces
    elements.searchInput.value='';
};

export const clearResults = () =>{
    elements.searchResList.innerHTML = ''; //removing previous results
    
};


const limitRecipeTitle = (title,limit = 17) => {
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

export const renderResults = recipes => {
    //for each result rendexRecipe is called
    recipes.forEach(renderRecipe)
};