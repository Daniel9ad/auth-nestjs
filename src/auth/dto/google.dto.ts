import { IsString } from "class-validator"

export class GoogleDto{
    @IsString()
    given_name: string
    @IsString()
    family_name: string
    @IsString()
    email: string
}