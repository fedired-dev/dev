/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


export class UserBlacklistAnntena1689325027964 {
    name = 'UserBlacklistAnntena1689325027964'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "antenna_src_enum" ADD VALUE 'users_blacklist' AFTER 'list'`);
    }

    async down(queryRunner) {
    }
}
