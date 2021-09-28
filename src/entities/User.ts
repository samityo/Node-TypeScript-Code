import {JsonConverter, JsonObject, JsonProperty} from 'ta-json';
import {DateConverter} from '../util/DateConverter';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@JsonObject()
@Entity({name: 'users'})
export class User {
    @JsonProperty()
    @PrimaryGeneratedColumn()
    @PrimaryColumn()
    id: number;

    @JsonProperty()
    @Column('varchar')
    email: string;

    @JsonProperty()
    @Column('varchar')
    firstName: string;

    @JsonProperty()
    @Column('varchar')
    lastName: string;

    @JsonProperty()
    @Column('varchar')
    avatar: string;

    @Column('char', {length: 60})
    password: string;

    @JsonProperty()
    @Column('boolean', {nullable: false, default: 0})
    status: boolean;

    @JsonProperty()
    @Column('text', {default: 'ROLE_USER'})
    roles: string;

    @JsonProperty()
    @JsonConverter(new DateConverter())
    @Column('datetime')
    createdAt: Date;

    @Column('datetime', {nullable: true})
    loggedinAt: Date;

    get rolesAsArray() {
        return this.roles.split(',');
    }
}