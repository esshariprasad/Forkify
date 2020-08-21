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
        console.log("HELLO");
        renderLoader(elements.searchRes);
        // 4) Search for recipes
          await  state.search.getResults(); //getResults is aync functions which returns a promise

          clearLoader();
        // 5) render results on UI //results are present in result variable
        searchView.renderResults(state.search.results);

    }

}

elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault(); // to stop reloading
    controlSearch();
})





