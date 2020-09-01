import Search from './models/Search';
import List from './models/List';
import { elements, renderLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';

import Recipe from './models/Recipe';
/** Global State of the app
 * - Search object
 * - Current recipe object
 * Shopping list object
 * Liked recipes
 *
 */
 const state = {}
//testing
window.state = state;

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search) searchView.highlightSelected(id);
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
        clearLoader();
        recipeView.renderRecipe(state.recipe);
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


/*
**
LIST Controller

*/

const controlList = () =>{
    //create a new list if there in none yet
    if(!state.list) state.list = new List();
    // for each ingredient we add to view
    state.recipe.ingredients.forEach(el =>{
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    
        });
    }         





    //Handle delte and update list item events

    elements.shopping.addEventListener('click',e =>{
        // closed shooping item then reads data-itemid* if drom it
        const id = e.target.closest('.shopping__item').dataset.itemid;
      
        //Handle the delete button

        if(e.target.matches('.shopping__delete,.shopping__delete *')) {
            // Delete from state
            
            state.list.deleteItem(id);
            
            // Delete from UI
            listView.deleteItem(id);
           
        }
        
        //Handle count update
        else if (e.target.matches('.shopping__count-value')){
            //read input from text box
            const val = parseFloat(e.target.value,10);
            
            state.list.updateCount(id,val);
        }
        
    
    });

// Handling recipe button clicks
elements.recipe.addEventListener('click',e =>{
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        // Decrease button is clicked
        if (state.recipe.servings >1 ){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.btn-increase,.btn-increase *'))
    {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
        
    }
    else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        controlList();
    }

});

window.l = new List();
