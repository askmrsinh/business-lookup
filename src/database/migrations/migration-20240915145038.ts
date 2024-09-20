import { Migration } from '@mikro-orm/migrations';

export class Migration20240915145038 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table `business` (`id` text not null, `name` text not null, `latitude` real not null, `longitude` real not null, `type` text not null, primary key (`id`));'
    );
  }
}
