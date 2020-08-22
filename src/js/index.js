import Search from './models/Search'
import { elements, renderLoader, clearLoader } from './view/base'
import * as searchView from './view/searchView'
/** Global State of the app
 * - Search object
 * - Current recipe object
 * Shopping list object
 * Liked recipes
 *
 */
 const state = {}
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
        // 4) Search for recipes
          await  state.search.getResults(); //getResults is async functions which returns a promise

          searchView.renderResults(state.search.results);
         
          clearLoader();
        // 5) render results on UI //results are present in result variable
        

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
        console.log(goToPage); 
    }
})

elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault(); // to stop reloading
    controlSearch();
});





