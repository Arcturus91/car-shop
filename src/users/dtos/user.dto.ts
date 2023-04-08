import { Expose } from 'class-transformer';

export class UserDto {
  //here are the properties explicitely i want to sent out
  @Expose()
  id: number;
  @Expose()
  email: string;
}
