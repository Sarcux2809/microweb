import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class datos {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Usuario: string;

  @Column()
  Contraseña: string;

  @Column()
  Correo: string;
}