import {JsonConverter, JsonObject, JsonProperty} from 'ta-json';
import {DateConverter} from '../util/DateConverter';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@JsonObject()
@Entity({name: 'permissions'})
export class Permission {
    @JsonProperty()
    @PrimaryGeneratedColumn()
    @PrimaryColumn()
    id: number;

    @JsonProperty()
    @Column('varchar', {nullable: false, length: 100})
    role: string;

    @JsonProperty()
    @Column('varchar', {nullable: false, length: 255})
    resource: string;

    @JsonProperty()
    @Column('boolean', {default: 1, nullable: false})
    isGranted: boolean;

    @JsonProperty()
    @Column()
    action: string;

    @JsonProperty()
    @Column('enum', {nullable: false, default: 'api', enum: ['api', 'web']})
    type: string;

    @JsonProperty()
    @JsonConverter(new DateConverter())
    @Column('datetime')
    createdAt: Date;
}