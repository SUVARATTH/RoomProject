const setResponse=(res,status,statusmessage,data)=>{
    if(!status){
        return res.status(400).json({status:400,error_msg:statusmessage.message})
    }
    else{
        return res.status(200).json({status:200,msg:statusmessage,data:data})
    }
}
module.exports=setResponse