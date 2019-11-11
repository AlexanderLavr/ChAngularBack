import { Injectable, Inject } from '@nestjs/common';
import { users, user_roles } from './users.entity';
import * as bcrypt from 'bcrypt';
import { getRole } from '../help/actions';
import { emailTemplate } from '../common/email.template';
import * as jwtr from 'jwt-then';
import env from '../config/config';
import * as Stripe from 'stripe';



const nodemailer = require('nodemailer');
const stripe = new Stripe('sk_test_Ep1gWOI6xLGwfezd6SxInQiO000k8Emyc4');

@Injectable()
export class UsersService { 
  constructor(
    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof users,
    @Inject('USER_ROLES_REPO') private readonly USER_ROLES_REPO: typeof user_roles
  ) { }

  async findAll(res): Promise<users[]> {
    try {
      const users: any = await this.USERS_REPOSITORY.findAll<users>();
      if (users.length !== 0) {
        return res.status(200).send({
          success: true,
          data: users
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Users not found',
          data: null
        });
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }
  
  async findOne(req, res): Promise<users[]> {
    try {
      const user = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['id', 'firstname', 'secondname', 'email'], where: { id: req.params.id } });
      if (user) {
        return res.status(200).send({
          success: true,
          data: user
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async changeAvatar(req, res){
    try {
      const users: any = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
      if (users) {
      await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
        return res.status(200).send({
          success: true,
          data: req.body.imageProfile
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Users not found',
          data: null
        });

      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async getAvatar(req, res): Promise<any> {
    try {
      const users: any = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['imageProfile'], where: { id: req.params.id } });
      const avatar = users.dataValues.imageProfile
        res.status(200).send({
          success: true,
          data: avatar
        });
    }catch(err){
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async delete(req, res): Promise<any> {
    let role = await getRole(req.headers.authorization);
    try {
      if(role.isAdmin[0] === 'admin'){
        const check = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
        if (check) {
          await this.USER_ROLES_REPO.destroy({ where: { users_id: req.params.id } });
          await this.USERS_REPOSITORY.destroy({ where: { id: req.params.id } });
          return res.status(200).send({
            success: true,
            message: 'Delete is done'
          });
        } else {
          return res.status(404).send({
            success: false,
            message: 'User not found',
            data: null
          });

        }
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async update(req, res): Promise<any> {
    try {
      const check = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
      if (check) {
        await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
        return res.status(200).send({
          success: true,
          message: 'Update is done'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });

      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async userUpdate(req, res): Promise<any> {
    try {
      const check = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
      if(req.body.hasOwnProperty('password')){
        req.body = {
          password: await bcrypt.hash(req.body.password, 10)
        }
        if (check) {
          await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
          return res.status(200).send({
            success: true,
            message: 'Update is done'
          });
        } else {
          return res.status(404).send({
            success: false,
            message: 'User not found',
            data: null
          });
        }
      }
      if (check) {
        await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
        return res.status(200).send({
          success: true,
          message: 'Update is done'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }
  

  async registerNewUser(req, res): Promise<any> {
    let { firstname, secondname, email, password} = req.body;

    const defaultProfile = 'data:image/png;base64,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'
    const newUser: any = {
      id: null,
      firstname: firstname,
      secondname: secondname,
      password: await bcrypt.hash(password, 10),
      email: email,
      imageProfile: defaultProfile
    };
    try {
      const matchUser: any = await this.USERS_REPOSITORY.findOne({ where: { email: newUser.email } })
      if(!matchUser){
        await this.USERS_REPOSITORY.create<users>(newUser);

        const user: any = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['id'], where: { email: newUser.email } });
        const newId = user.dataValues.id
        const newRole = {
          users_id: newId,
          roles_id: 2
        }
        await this.USER_ROLES_REPO.create<user_roles>(newRole);
        res.status(200).send({
          success: true,
          message: 'User Successfully created'
        });
      }else return res.status(401).send(`User with E-mail:${matchUser.email} alredy exist!`);
    }catch(err){
      res.status(500).send('Register failed try again!');
    }
  }
}