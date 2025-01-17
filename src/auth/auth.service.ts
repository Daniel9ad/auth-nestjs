import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GoogleDto } from './dto/google.dto';

const EXPIRE_TIME = 140 * 1000;

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto)
        const payload = {
            username: user.email,
            sub: {
                name: user.name
            }
        }
        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret: process.env.jwtSecretKey
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey
                }),
                expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
            }
        }
    }

    async validateUser(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.username)
        if (user && (await compare(dto.password, user.password))) {
            const { password, ...result } = user
            return result
        } else {
            throw new UnauthorizedException()
        }
    }

    async findOrCreateGoogleUser(googleDto: GoogleDto) {
        const user = await this.userService.findByEmail(googleDto.email);
        if (!user) {
            const user = await this.userService.create({
                name: googleDto.given_name,
                email: googleDto.email,
                password: "fsdfsdfsdsdf"
            });
            const payload = {
                username: user.email,
                sub: {
                    name: user.name
                }
            }
            return {
                user,
                backendTokens: {
                    accessToken: await this.jwtService.signAsync(payload, {
                        expiresIn: '1h',
                        secret: process.env.jwtSecretKey
                    }),
                    refreshToken: await this.jwtService.signAsync(payload, {
                        expiresIn: '7d',
                        secret: process.env.jwtRefreshTokenKey
                    }),
                    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
                }
            }
        }
        const payload = {
            username: user.email,
            sub: {
                name: user.name
            }
        }
        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret: process.env.jwtSecretKey
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey
                }),
                expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
            }
        };
    }

    async refreshToken(user: any) {
        const payload = {
            username: user.username,
            sub: user.sub
        }
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
                secret: process.env.jwtSecretKey
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: process.env.jwtRefreshTokenKey
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        }
    }
}