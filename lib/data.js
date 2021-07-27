const path = require('path');
const fs = require('fs')

const lib = {}

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = (dir,file,data,callback) =>{

    //open the file for writing 
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){

            const stringData = JSON.stringify(data);
            console.log(data)
            //writing to the file 
            fs.writeFile(fileDescriptor,stringData,(err)=>{
                if(!err){
                    fs.close(fileDescriptor,(err)=>{
                        if(!err){
                            callback(false)
                        }else{
                            callback('could not close the file')
                        }
                    })
                }else{
                    callback('could not write to the file ')
                }
            })
        }else{
            callback('could not open the file , it may already exists'+err)
        }
    })
}

lib.read = (dir , file , callback ) =>{
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',(err, data)=>{
            if(!err){
                    
            }else{
                callback('file does not exists !')
            }
    })
}

module.exports = lib