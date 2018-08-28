const mans = (state=[], action) =>{  
    if(action.type === "ADD_MAN"){
        return [
            ...state,
            action.payload
        ];
    }else if(action.type === "DELETE_MAN"){
        return state.filter(man => man.key !== action.payload);
    }else if(action.type === "EDIT_MAN"){
        return action.payload;
    }
    return state;
}

export default mans;
