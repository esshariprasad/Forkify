import axios from 'axios';


export default class Search {
    constructor(id)  {
        this.id = id;
    }
    //all variables are set here for recipe
    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            
        }
        catch(error){
            console.log(error);
            alert('Something went wrong :(')
        }
    
    }
    calcTime() {

        //Assuming that we need 15min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons','tablespoon','ounce','ounces','teaspoon','teaspoons','cups','pounds'];
        
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units =   [...unitsShort,'kg','g']; 
        const newIngredients = this.ingredients.map(el =>{

            //Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit,unitsShort[i]);
            });
        
            //Remove Paretheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g," ");
            

            //Parse ingredients into count,unit
            //each ingredient in ingredients array
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2))
            let objIng;
            if (unitIndex > -1){
                
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval("4+1/2")--> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if(arrCount.length === 1){
                    //1-1/3 will be taken as 1+1/3 and eval does that
                    count = eval(arrIng[0].replace('-','+'));
                }
                else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                    
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice( unitIndex + 1).join(' ')
                    
                }

            }
            //gives not an number(nan) when there a text
            else if (parseInt(arrIng[0],10)) {

                //There is no unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    //italian sauce
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if( unitIndex === -1){
                //There is no unit and no number in 1st postition

                objIng ={
                    count : 1,
                    unit: '',
                   // ingredient: ingredient
                   ingredient

                }
                

            }
            return objIng;
        
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec'? this.servings - 1: this.servings +1;
        

        //Ingredients

        
        this.ingredients.forEach(ing =>{
            ing.count *=  (newServings/ this.servings);
            // 4 now 3 * this.servings holds old servings
            // 4 *(3/4)
        });
        
        this.servings = newServings;
    }
}