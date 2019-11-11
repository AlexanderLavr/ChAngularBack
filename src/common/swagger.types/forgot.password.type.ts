import { ApiModelProperty } from '@nestjs/swagger';

export class FogorgotPasswordEmail{
    @ApiModelProperty()
    email: string
}