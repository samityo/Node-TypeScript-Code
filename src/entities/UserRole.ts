import {JsonConverter, JsonObject, JsonProperty} from 'ta-json';
import {DateConverter} from '../util/DateConverter';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@JsonObject()
@Entity({name: 'user_roles'})
export class UserRole {
    @JsonProperty()
    @PrimaryGeneratedColumn()
    @PrimaryColumn()
    id: number;

    @JsonProperty()
    @Column('varchar', {length: 50})
    name: string;

    @JsonProperty()
    @JsonConverter(new DateConverter())
    @Column('datetime', {nullable: false})
    createdAt: Date;

}