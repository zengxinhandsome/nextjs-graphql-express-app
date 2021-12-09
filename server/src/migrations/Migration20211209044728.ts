import { Migration } from '@mikro-orm/migrations';

export class Migration20211209044728 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_created_at_check";');
    this.addSql('alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "user" drop constraint if exists "user_email_check";');
    this.addSql('alter table "user" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "user" alter column "email" set not null;');

    this.addSql('alter table "post" drop constraint if exists "post_created_at_check";');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "created_at" set default \'NOW()\';');
  }

}
