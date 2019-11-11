import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class auth extends Model<auth> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: '_id',
  })
  _id: number;

  @Column
  password: string;

  @Column
  email: string;
}