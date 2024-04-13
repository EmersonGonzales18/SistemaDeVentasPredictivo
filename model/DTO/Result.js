class Result{
    constructor(error,status,result,msg){
        this.error = error;
        this.status = status;
        this.result = result;  
        this.msg=msg;
    }
}
module.exports = Result