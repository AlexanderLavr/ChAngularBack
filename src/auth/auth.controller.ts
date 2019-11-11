import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiImplicitBody, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Login } from '../common/swagger.types';





@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local')) 
    @ApiUseTags('auth')
    @ApiImplicitBody({name: 'params', type: Login})
    @Post()
    async login(@Req() req, @Res() res){
        return this.authService.login(req.user, res);
    }
}

