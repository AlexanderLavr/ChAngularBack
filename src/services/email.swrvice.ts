import { Injectable, Inject } from '@nestjs/common';
import * as jwtr from 'jwt-then';
import env from '../config/config';
import { users } from '../users/users.entity';
import { books } from '../books/books.entity';
import { emailTemplate } from '../common/email.template';



const nodemailer = require('nodemailer');

@Injectable()
export class EmailService { 
  constructor(
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof users,
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof books
  ) { }

  async forgotPassword(body): Promise<any> {
      console.log(body);
      
    const check = await this.USERS_REPOSITORY.findOne<users>({ where: { email: body.email } });
    if (!check){
      return { message: 'The user with such an email does not exist! Try again!' }
    }

      async function sendEmail() {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: env.GMAIL_USER, 
                pass: env.GMAIL_PASSWORD
            }
            
        });
        
        let email = emailTemplate();
        let userid = {
          id: check.id
        }
        
        const id = await jwtr.sign(userid, 'secret')

        let info = await transporter.sendMail({
            from: env.GMAIL_USER,
            to: body.email,
            subject: "Book's shop",
            html: email
        });
        console.log('Message sent: %s', info.messageId);
        
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s')
        }
        sendEmail().catch(error=>console.log(error));
        return { message: 'A letter was sent to your mail, follow the link and change the password.' }
    }


}
