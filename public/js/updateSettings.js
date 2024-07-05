/* eslint-disable */
import axios from 'axios';
import {showAlert} from './alerts'

export const updateSettings = async (data,type) => {
console.log("inside form");
    try {
        const url=type==='password'?"http://localhost:3000/api/v1/users/updateMyPassword":"http://localhost:3000/api/v1/users/updateMe "
        // const response = await fetch(url, {
          
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        // const dataResponse = await response.json();
        const dataResponse=await axios({
            method:"PATCH",
            url,
            data
        });
        console.log(dataResponse);
 if (dataResponse.status==="success") {
          showAlert('success',`${type} Updated Successfully`)
         

        }
        else{
             showAlert('error',dataResponse.message);
        }

    }
            catch(err){
                showAlert('error',err.message);
            }
        }
