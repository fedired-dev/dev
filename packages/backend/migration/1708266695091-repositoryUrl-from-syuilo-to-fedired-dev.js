/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


export class RepositoryUrlFromSyuiloToFediredDev1708266695091 {
    name = 'RepositoryUrlFromSyuiloToFediredDev1708266695091'

    async up(queryRunner) {
        await queryRunner.query(`UPDATE "meta" SET "repositoryUrl" = 'https://github.com/fedired-dev/fedired' WHERE "repositoryUrl" = 'https://github.com/srnovus/fedired'`);
    }

    async down(queryRunner) {
        // no valid down migration
    }
}
