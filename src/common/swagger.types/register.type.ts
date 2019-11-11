import { ApiModelProperty } from "@nestjs/swagger"

export class Registration {
    @ApiModelProperty()
    firstname: String

    @ApiModelProperty()
    secondname: String

    @ApiModelProperty()
    password: String

    @ApiModelProperty()
    email: String
}