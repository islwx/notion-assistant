let COLORS = ["default", "gray", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink"]

function mulseletByArr(arr){
    let multi_select_obj = []
    let ele = null;
    for (ele in arr){
        multi_select_obj.push({name: ele});
    }
    return multi_select_obj;
}

function titleByStr(str){
    return {
        "title":[
            {
                "type": "text",
                "text": {
                    "content":str
                }
            }
        ]
    }
}

function textByStr(str){
    return {
        "text":[
            {
                "text":{
                    "content": str
                }
            }
        ]
    }
}

function getSelect(str, color=null){
    let select_obj =  {
        "select":{
            "name":str
        }
    };
    if (color != null && color in COLORS) {
        select_obj['select']["color"] = color;
    }
    return select_obj;
}

function DateByISO8601(start, end=null){
    let date={
        "date":{
            "start": start
        }
    }
    if (end != null){
        date['date']['end'] = end;
    }
    return date
}