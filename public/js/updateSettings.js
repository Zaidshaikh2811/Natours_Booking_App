/* eslint-disable */
import axios from 'axios';
import {showAlert} from './alerts'

export const updateSettings = async (data,type) => {

    try {
        const url=type==='password'?"/api/v1/users/updateMyPassword":"/api/v1/users/updateMe "
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
