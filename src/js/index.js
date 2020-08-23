import Search from './models/Search'
import { elements, renderLoader, clearLoader } from './view/base'
import * as searchView from './view/searchView'
import Recipe from './models/Recipe'
/** Global State of the app
 * - Search object
 * - Current recipe object
 * Shopping list object
 * Liked recipes
 *
 */
 const state = {}


 /*
Search Controller

 */
 const controlSearch = async () =>{
    // 1) Get query from view (Dom is selected in searchVIew)
    const query = searchView.getInput();
    if(query){
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        //adding loader by passing parent element
        renderLoader(elements.searchRes);
        try{
        // 4) Search for recipes

          await  state.search.getResults(); //getResults is async functions which returns a promise

          searchView.renderResults(state.search.results);
         
          clearLoader();
        // 5) render results on UI //results are present in result variable
        } catch(err){
            alert('Some went wrong :(');
            clearLoader();
        }

    }

}

//how we add event to elements which is not already loaded so we here use 
//event deligation
elements.searchResPages.addEventListener('click',e =>
{   const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10); //reading from data-goto attribute
        searchView.clearResults();
        searchView.renderResults(state.search.results,goToPage);
        
    }
})

elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault(); // to stop reloading
    controlSearch();
});



/* Recipe Controller
*/

const controlRecipe = async () =>{
    //Get Id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);
    //only if we have receipe id
    if(id) {

        //prepare UI for changes


        //Create new recipe object
        state.recipe = new Recipe(id);
        

        try{
        //Get recipe data 
        //get Recipe returns a promise we use await to consume it
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();   
        //Calculate serving and time
        state.recipe.calcTime();
        state.recipe.calcServings();
            
        //Render recipe
        console.log(state.recipe);
    }
    catch(error){
        //alert('Error processing recipe');
        console.log(error);
    }     
        

    }

}


// //adding to browser
// window.addEventListener('hashchange', controlRecipe);
// //adding control Recipe to load
// window.addEventListener('load',controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));