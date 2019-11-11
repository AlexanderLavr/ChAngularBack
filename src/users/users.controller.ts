import { Controller, Get, Post, Req, Res, Put, Delete, UseGuards, Body, Header } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { ApiUseTags, ApiImplicitParam, ApiImplicitBody, ApiBearerAuth, ApiResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { FogorgotPasswordEmail, Registration } from '../common/swagger.types';
import { users, user_roles } from './users.entity';
import { UsersType } from '../common/swagger.types/test.type';
import { PaymentService } from '../services/payment.service';
import { EmailService } from '../services/email.swrvice';



@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService, 
        private readonly authService: AuthService,
        private readonly paymentService: PaymentService,
        private readonly emailService: EmailService) { }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiUseTags('admin')
    @ApiOkResponse({ description: 'Success: true', type: UsersType})
    @Get()
    findAll(@Res() res: Response): Promise<users[]> {
        return this.usersService.findAll(res);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiUseTags('auth')
    @ApiImplicitParam({name: 'id', required: true})
    @Get('/avatar/:id')
    getAvatar(@Req() req: Request, @Res() res: Response) {
        return this.usersService.getAvatar(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiUseTags('shared admin-user')
    @Put('/avatar/:id')
    changeAvatar(@Req() req: Request, @Res() res: Response) {
        return this.usersService.changeAvatar(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiUseTags('admin')
    @Get('/:id')
    findOne(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.findOne(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiUseTags('admin')
    @Delete('/:id')
    delete(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.delete(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiUseTags('admin')
    @Put('/:id')
    update(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.update(req, res);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/user/:id')
    @ApiUseTags('shared admin-user')
    userUpdate(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.userUpdate(req, res);
    }

    @Put('/forgot/password')
    @ApiBearerAuth() 
    @ApiUseTags('auth')
    @ApiImplicitBody({name: 'params', type: FogorgotPasswordEmail})
    forgotPassword(@Body() body: Body): any {
        return this.emailService.forgotPassword(body)
    }


    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth() 
    @ApiUseTags('user')
    @ApiImplicitBody({name: 'params', type: FogorgotPasswordEmail})
    @Put('stripe/payment/product')
    stripe(@Body() body: Body): any {
        return this.paymentService.stripe(body);
    }

    @Post('/register')
    @ApiBearerAuth() 
    @ApiUseTags('auth')
    @ApiImplicitBody({name: 'params', type: Registration})
    registerNewUser(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.registerNewUser(req, res);
    }
}
