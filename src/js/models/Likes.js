export default class Likes{
    constructor(){
        this.likes =[]; //likes array
    }

    addLike(id,title,author,img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        // Persist the data in local storage
        this.persistData();
        return like;
    }

    deleteLike(id){
        //find index of the id passed in likes array
        const index = this.likes.findIndex(el => el.id === id);
        //deleting the item from likes array
        this.likes.splice(index,1);

        this.persistData();
    }

    isLiked(id){
        
        // return - if recipe with recipe id is not liked
        return this.likes.findIndex(el => el.id === id) !== -1;

    }

    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    getNumlikes(){
        return this.likes.length;
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        //Restore likes from the localStorage;
        if(storage) this.likes = storage;

    }
}