const ava = require('ava');
const fs = require('fs');
const path = require('path');

const Parser = require('../../../../lib');
const expect = require('./expect/alter-table-options.json');

const sql = fs.readFileSync(path.join(__dirname, 'sql', 'create-table.sql')).toString();

// @ts-ignore
ava('Compact formatter: Should alter table options.', t => {
  const parser = new Parser('mysql');
  parser.feed(sql);
  parser.feed(`
    ALTER TABLE person
    AUTO_INCREMENT 2
    AVG_ROW_LENGTH 256
    DEFAULT CHARACTER SET latin1,
    DEFAULT CHARSET utf8,
    COLLATE latin1_ci,
    COMMENT "alter table test",
    COMPRESSION "ZLIB",
    CONNECTION "my:sql//",
    DATA DIRECTORY "/tmp/data",
    INDEX DIRECTORY "/tmp/index",
    DELAY_KEY_WRITE 42,
    ENCRYPTION "Y",
    ENCRYPTION_KEY_ID 99,
    IETF_QUOTES YES,
    ENGINE XtraDB,
    INSERT_METHOD LAST,
    KEY_BLOCK_SIZE 64,
    MAX_ROWS 1e7,
    MIN_ROWS 2,
    PACK_KEYS DEFAULT;

    ALTER TABLE pet
    PAGE_CHECKSUM 8
    PASSWORD "1q2w3e",
    ROW_FORMAT FIXED,
    STATS_AUTO_RECALC DEFAULT,
    STATS_PERSISTENT 11
    STATS_SAMPLE_PAGES 10,
    TRANSACTIONAL = 1,
    WITH SYSTEM VERSIONING,
    TABLESPACE asd STORAGE MEMORY
    UNION (table1, table2);
  `);

  const results = parser.results;

  const json = parser.toCompactJson(results);
  // fs.writeFileSync(path.join(__dirname, 'expect', 'alter-table-options.json'), JSON.stringify(json, null, 2));
  // for some reason t.deepEqual hangs process
  t.is(JSON.stringify(json), JSON.stringify(expect));
  // t.pass();
});
