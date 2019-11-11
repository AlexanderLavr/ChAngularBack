import { ApiModelProperty } from '@nestjs/swagger';

export class UsersType {

    @ApiModelProperty()
    id: number;
  
    @ApiModelProperty()
    firstname: string;
    
    @ApiModelProperty()
    secondname: string;
  
    @ApiModelProperty()
    password: string;
  
    @ApiModelProperty()
    email: string;
  
    @ApiModelProperty()
    imageProfile: string;
}