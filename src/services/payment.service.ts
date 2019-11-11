import { Injectable, Inject } from '@nestjs/common';
import { users } from '../users/users.entity';
import * as Stripe from 'stripe';
import { books } from '../books/books.entity';
import { longStackTraces } from 'bluebird';


const stripe = new Stripe('sk_test_Ep1gWOI6xLGwfezd6SxInQiO000k8Emyc4');

@Injectable()
export class PaymentService { 
  constructor(
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof users,
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof books,

  ) { }


  async createSource (customer, stripeToken) {
    const source = stripe.customers.createSource(customer.id, {
      source: `tok_${stripeToken.card.country.toLowerCase()}`
    })
    return source
  }
  async createCharge (source, price) {
    let verifyCustomer: any = source.customer;
    const res = stripe.charges.create({
      amount: price,
      currency: 'usd',
      customer: verifyCustomer
    })
    return res
  }

  async checkAndDeleteBooksCount (buyBooks) {
    const success: boolean = true;
    let allBooks = await this.BOOKS_REPOSITORY.findAll<books>();

    
    let check = await buyBooks.forEach(async el => {
        allBooks.forEach((dbBook: any)=>{
            if(el._id === dbBook._id){
                if((el.totalCount <= dbBook.amount) && dbBook.amount !== 0){
                    dbBook.amount -= el.totalCount;
                    this.BOOKS_REPOSITORY.update<books>({amount: dbBook.amount}, { where: { _id: dbBook._id } })
                }else{}
                
            }
        })
    });
    return success;
  }



  async stripe(body): Promise<any> {
    const { stripeToken, price, buyBooks, userEmail } = body;

    let payment = await stripe.customers.list({email: userEmail});
    
    if(!payment.data.length) {
        const customer = await stripe.customers.create({
            email: userEmail
        })
        let source = await this.createSource(customer, stripeToken);
        let charge = await this.createCharge(source, price);
        return charge;
    }
    
    const customer = payment.data[0];
    let source = await this.createSource(customer, stripeToken);
    
    let checkBooks = await this.checkAndDeleteBooksCount(buyBooks)
    if(!checkBooks){
        return { message: 'Impossible. The number of selected books exceeded'}
    }
    
    let charge = await this.createCharge(source, price);
    return charge;
  }

}