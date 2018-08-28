const filter = (state = '', action) =>{
    if(action.type === "FILTER_MAN"){
        return action.payload;  
    }
    return state;
}

export default filter;