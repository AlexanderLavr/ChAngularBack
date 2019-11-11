import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';


@Table
export class user_roles extends Model<user_roles> {

  @ForeignKey(() => users)
  @Column
  users_id: number;

  @ForeignKey(() => roles)
  @Column
  roles_id: number;
}


@Table
export class users extends Model<users> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: 'id',
  })
  id: number;

  @Column
  firstname: string;
  
  @Column
  secondname: string;

  @Column
  password: string;

  @Column
  email: string;

  @Column
  imageProfile: string;

  @BelongsToMany(() => roles, () => user_roles)
  roleId: user_roles[];
}

@Table
export class roles extends Model<roles> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  })
  id: number;

  @Column
  roleName: string


  @BelongsToMany(() => users, () => user_roles)
  datarole: users[];
}

