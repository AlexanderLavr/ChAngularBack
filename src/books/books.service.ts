import { Injectable, Inject, HttpException } from '@nestjs/common';
import { books } from './books.entity';
import { Response } from 'express';
import { getRole } from '../help/actions';


@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof books) { }

  async findAllAdmin(req, res): Promise<books[]> {
    let arrayAllBooks =  await this.BOOKS_REPOSITORY.findAll<books>();
    let allPages = arrayAllBooks.length / 5;
    allPages = Math.ceil(allPages);
    let pageSize = 5;

    let startSearch = req.params.page * 5;
    let arrayBooks =  await this.BOOKS_REPOSITORY.findAll<books>({limit: pageSize, offset: startSearch});
    
    return res.status(200).send({
      success: true,
      data: arrayBooks,
      allPages: allPages
    });
  }

  async findAllUser(req, res): Promise<books[]> {
    let arrayAllBooks =  await this.BOOKS_REPOSITORY.findAll<books>();
    return res.status(200).send({
      success: true,
      data: arrayAllBooks
    });
  }

  async findOne(req, res): Promise<books> {
    let book: any = await this.BOOKS_REPOSITORY.findOne<books>({ where: { _id: req.params.id } });
    if(book){
      return res.status(200).send({
        success: true,
        data: book
      });
    }else{
      return res.status(404).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }

  async updatBook(req, res): Promise<any> {
    if(req.params.id) {
      const book = req.body;
      await this.BOOKS_REPOSITORY.update<books>(book, { where: { _id: req.params.id } })
      return res.status(200).send({
        success: true
      });
    } else return res.status(404).send({
      success: false,
      message: 'Requset body is incorrect!',
    });

  }

  async searchBooks(req, res): Promise<books[]> {
    const title = req.params.title
    console.log(title)
    const Sequelize = require('sequelize');
    
    const Op = Sequelize.Op;
    const books = await this.BOOKS_REPOSITORY.findAll<books>({
      where:
      {
        title: {
          [Op.substring]: `${title}`
        }
      }
    });
    return res.status(200).send({
      success: true,
      data: books
    });
  }




  
  async sortBooks(req, res): Promise<any> {
    if(req.params.title && req.params.page) {
      let page:number = req.params.page;
      let field:string = req.params.title;
      const  allSort = (property)=>{
        if(property === 'price' || property === 'amount'){
          return function (a, b){
            let result = (Number(a[property]) < Number(b[property])) ? -1 : (Number(a[property]) > Number(b[property])) ? 1 : 0;
            return result 
          }
        }else{
          return function (a, b){
            let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result 
          }
        }
      }
      let arrayAllBooks =  await this.BOOKS_REPOSITORY.findAll<books>();
      arrayAllBooks.sort(allSort(field))

      let allPages = arrayAllBooks.length / 5;
      allPages = Math.ceil(allPages);
      let pageSize = 5;
      let sortArray:books[] = [];
      
      let startSearch = page * 5;
      let count:number = 0;
      
      arrayAllBooks.forEach((element:books, i) => {
        if(i > (startSearch - 1)){
          if(count !== pageSize){
            count++
            sortArray.push(element)
          }
          return
        }
      });
      return res.status(200).send({
        success: true,
        data: sortArray,
        allPages: allPages
      });
    } else return res.status(404).send({  
      success: false,
      message: 'Requset is incorrect!',
    });
  }

  async deleteBook(req, res): Promise<any> {
    let role = await getRole(req.headers.authorization);
    try{
      if(role.isAdmin[0] === 'admin'){
        if (req.params.id) {
            await this.BOOKS_REPOSITORY.destroy({ where: { _id: req.params.id } })
          return res.status(200).send({
            success: true
          });
        } else return res.status(404).send({
          success: false,
          message: 'Requset body is incorrect!',
        });
      }
    }catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async addBook(req, res): Promise<any> {
    if (req.body.title){
      const book = req.body;
      await this.BOOKS_REPOSITORY.create<books>(book)
      return res.status(200).send({
        success: true,
        message: 'Add is done!'
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }
}