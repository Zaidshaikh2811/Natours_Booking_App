/* eslint-disable */

import {showAlert} from './alerts'


export const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/v1/users/login', {
          
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

        console.log(dataResponse);
    } catch (error) {
        console.log(error.message);
        showAlert('error',error.message);
    }
};


export const logout=async()=>{
    console.log("LOGGED OUT");
    try{
 const response = await fetch('http://localhost:3000/api/v1/users/logout', {
          
            method: 'GET',
         
        });

     
        const dataResponse = await response.json();
        if(dataResponse.status==='success'){
            location.reload(true)
        }
         else{
            console.log(dataResponse);
             showAlert('error',dataResponse.message);
        }
    }
    catch(error){
        showAlert('error',"Error logging out")
    }
}
