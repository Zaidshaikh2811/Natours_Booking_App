/* eslint-disable prettier/prettier */
const nodemailer=require('nodemailer')
const pug=require('pug')
const {convert }=require('html-to-text')

module.exports=class Email{
    constructor(user,url){
this.to=user.email;
this.firstName=user.name.split(' ')[0];
this.url=url;
this.from=`Muhammad Ali <${process.env.EMAIL_FROM}>`;
    }

    newTransport(){
        if(process.env.NODE_ENV==='production'){
            return nodemailer.createTransport(
                {
                    service:'SendGrid',
                    auth:{
user:process.env.SENDGRID_USERNAME,
pass:process.env.SENDGRID_PASSWORD
                    }
                }
            );
        }
    return nodemailer.createTransport({
host:process.env.EMAIL_HOST,
port:process.env.EMAIL_PORT,
auth:{
    user:process.env.EMAIL_USERNAME,
    pass:process.env.EMAIL_PASSWORD
}
 });
    }

    async send(template,subject){
        //sent the actually email
        const html=pug.renderFile( `${__dirname}/../views/email/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
        })

            const mailOptions={
        from: this.from,
        to:this.to,
        subject,
        html,
        text:convert(html)
        // this
    };



     await this.newTransport().sendMail(mailOptions); 

 }

  async sendWelcome(){
   await this.send('Welcome',"welcome to the Natours Family")

                    }  


                    async sendPasswordReset(){
                        await this.send("PasswordReset",'Your Password Reset Token Valid for  only 10 minutes')
                    }
};




