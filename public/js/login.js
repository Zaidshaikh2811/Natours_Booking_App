/* eslint-disable */

import {showAlert} from './alerts'


export const login = async (email, password) => {
    try {
        const response = await fetch('/api/v1/users/login', {
          
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

     
        const dataResponse = await response.json();

           if (dataResponse.status==="success") {
          showAlert('success',"Logged in successfully")
          window.setTimeout(()=>{
            location.assign('/')
          },1500)

        }
        else{
             showAlert('error',dataResponse.message);
        }

     
    } catch (error) {
   
        showAlert('error',error.message);
    }
};


export const logout=async()=>{
   
    try{
 const response = await fetch('/api/v1/users/logout', {
          
            method: 'GET',
         
        });

     
        const dataResponse = await response.json();
        if(dataResponse.status==='success'){
            location.reload(true)
        }
         else{
         
             showAlert('error',dataResponse.message);
        }
    }
    catch(error){
        showAlert('error',"Error logging out")
    }
}
