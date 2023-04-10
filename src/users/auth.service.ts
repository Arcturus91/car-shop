import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex'); //randomBytes 8 means 8 bytes of array buffer data.
    //and the hex means we are gpoing to transforms such data to hexadecimal.
    //So a byte -- eight binary digits -- can always be represented by two hexadecimal digits.
    //but becasue we have 8 bytes, that means we will have 16 length string

    const hash = (await scrypt(password, salt, 32)) as Buffer; //32 bytes of output
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    //receive an email and password
    //hash it and compare with DB
    //if it is the same return true // success.

    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.'); //here i have the salt and the has separated but both in hexadecimal

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
