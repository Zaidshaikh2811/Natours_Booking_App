/* eslint-disable prettier/prettier */
/* eslint-disable */


import '@babel/polyfill';
import {login,logout} from './login';
import {updateSettings} from './updateSettings';
import { session } from './stripe';
import e from 'express';


const loginForm=document.querySelector('.form--login');
const logOutBtn=document.querySelector('.nav__el--logout')
const updateBtn=document.querySelector('.form-user-data')
const passwordUpdate=document.querySelector('.form-user-settings')
const bookButton = document.querySelector(".bookTour")

console.log("INDEX.JS")

if(loginForm){
   loginForm.addEventListener('submit',e=>{
       e.preventDefault();
     const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
   
    login(email,password);
    

    });
}
if(logOutBtn){
    console.log("logOutBtn");
   logOutBtn.addEventListener('click',logout);
}

if(updateBtn){
   updateBtn.addEventListener('submit',e=>{
   
       e.preventDefault();
       const form=new FormData();
       form.append('name',document.getElementById('name').value);
       form.append('email',document.getElementById('email').value);
       form.append('photo',document.getElementById('photo').files[0]);
   
   
    updateSettings(form,'data');
    

    });
}
if(passwordUpdate){
   passwordUpdate.addEventListener('submit',async e=>{
       e.preventDefault();
       document.querySelector('.btn--save-password').textContent="Updating..."
       console.log("passwordUpdate");
     const passwordCurrent=document.getElementById('password-current').value;
    const password=document.getElementById('password').value;
    const passwordConfirm=document.getElementById('password-confirm').value;
    
   
   await updateSettings({passwordCurrent,
password,
passwordConfirm},'password');
    
document.querySelector('.btn--save-password').textContent="SAVE PASSWORD"
document.getElementById('password-current').value='';
document.getElementById('password').value='';
document.getElementById('password-confirm').value='';
    });
}


if (bookButton) {
  bookButton.addEventListener('click', (e) => {
    console.log("INSIDE");
    e.target.textContent = 'Proccessing...';
    const { tourId } = e.target.dataset;
    session(tourId);
  });
}
