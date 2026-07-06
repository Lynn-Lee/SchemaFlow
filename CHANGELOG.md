# Changelog

## 1.20.1 (2026-04-07)


### Bug Fixes

* escape single quotes in DBML comments and match renamed index names (#1099) (1c49c7c)
* font family declaration in Tailwind config (#1094) (7b941bb)
* handle embedded quotes and CSV format in metadata import (#1116) (3442936)
* handle mixed-dialect types and comments in DBML export (#1097) (1a1df6e)
* resolve race condition between edge creation and handle registration (#1118) (81dae56)
* support index comments in DBML and SQL export (#1098) (ce95f83)

## 1.20.0 (2026-03-04)


### Features

* add check constraint support (#1046) (6879e19)
* add GIN index and array type support for PostgreSQL/CockroachDB (#1048) (de26f73)
* deterministic SQL export for PostgreSQL to MySQL/MSSQL (#1030) (fb19a7a)


### Bug Fixes

* add "New Database" button to Open Diagram dialog (#1041) (a43cc30)
* add auto-closing brackets to DBML editor (#1018) (f140d05)
* add dbml autocomplete (#1017) (fad5adc)
* add defaults in import for all databases (#1014) (cef9fb6)
* add import from canvas (#995) (8b31944)
* add index change diff (#1026) (a6d6482)
* add old Safari versions compatibility (#1058) (5314c88)
* add Oracle database support for SQL import (#1005) (9ac99d9)
* add proper cardinality symbols to DBML (#1055) (1c46f96)
* add SQL viewes support for import via ddl (#1044) (0502efd)
* add text wrapping and max-width to field comment tooltips (#1004) (ccfd94b)
* align relationships sidebar with cardinalities update (#1056) (1dd3c93)
* cardinality diff handle (#1038) (a63d2b3)
* change diff new id field (#1027) (0af7775)
* **comments:** fix comments dbml (#1013) (ac37848)
* constraints align create function (#1049) (d000024)
* correct FK placement for 1:1 relationships in PostgreSQL export (#1036) (f25cd45)
* correct relationship direction in metadata import (#1007) (87ac0ed)
* correct relationship direction in SQL import (#1003) (9b6d6db)
* correctly match DBML relationships when same table name exists in multiple schemas (#1057) (63febde)
* dbml editor spaces + refs on schemas (#1023) (a5d1f40)
* **dbml-import:** use defaultSchemas instead of hardcoded schema values (#1012) (d3205f7)
* ddl import auto increment (#1035) (c96466e)
* ddl import of scale and precision (#1031) (674ed22)
* enforce NOT NULL for primary key fields (#1061) (b21202e)
* export ddl index order (#1028) (2d666ba)
* **export-image:** inline SVG styles for relationship edges and cardinality markers (#1054) (a908d77)
* **filter:** improve filter UX - empty states + show all indicators (#1039) (8db2ddf)
* **filter:** show visible/total count badge for schema and area groups (#1045) (84e55f5)
* handle escape sequences and double-quotes in metadata JSON parsing (#1009) (f9c9dcf)
* hide check JSON button after 2 failed fix attempts (#1010) (1688423)
* improve UI for views (#1043) (21bbd48)
* mark primary key columns as NOT NULL when importing DBML (#1006) (e5ae46c)
* normalize index type comparison using database defaults (#1029) (d210319)
* normalize over-escaped default values in DBML export (#1059) (6aadab1)
* normalize relationship cardinalities so many is always on target (#1051) (88f4a28)
* nvm version (#1021) (1804f45)
* pg serial export sql (#1034) (f10c220)
* pk indexes sql export (#1024) (7060532)
* **postgres:** detect serial types and hide nextval defaults in smart query (#1032) (9e4b5a0)
* PostgreSQL serial type parsing (#1016) (db1cf45)
* PostgreSQL unique/primary key import handling (#1062) (5754538)
* preserve GIN index type in DBML export (#1075) (0b73295)
* preserve index type (e.g., GIN) during DBML import (#1089) (0e7fa6c)
* primary key index options (#1025) (83dd5ba)
* properly merge inline refs with notes in DBML export (#1019) (e977ba5)
* quote bare string defaults in DBML export sanitization (#1091) (9fe2722)
* rels dbml diffs (#1037) (c39b699)
* rels translations (#1052) (5bc2593)
* scroll navigates back (#1053) (9fb451e)
* search languages (#1042) (ded5b14)
* serial ddl import in pg (#1033) (6eae4b0)
* treat PostgreSQL decimal as synonym for numeric (#1020) (4098524)
* unique with pk on sql import (#1022) (20208f6)
* update image export scale options and set as 4x default (#1040) (6058db4)
* update-browserslist-db (#1001) (b16336b)
* upgrade vite (#1008) (bedc2c8)

## 1.19.0 (2025-12-09)


### Features

* add canvas relationship editor with inline controls (#996) (beeb6c0)


### Bug Fixes

* add actions to empty state (#986) (de5f172)
* add automatic data type synonym resolution for PostgreSQL imports (#994) (fbd04e9)
* add field comments indicators with tooltips (#989) (41c05c0)
* highlight FK columns in blue on canvas tables (#990) (07632e5)
* overlapping indication with hidden views (#988) (7428f46)
* port 80 bind permission error (#1000) (5b79c56)
* preserve index names when applying DBML changes (#997) (be26154)
* shift key for canvas selection + cursor indicator (#993) (1d6f4cd)
* style nullable indicators (#992) (3f53ab5)
* support Delete key in addition to Backspace for canvas deletion (#991) (94d7d3f)

## 1.18.1 (2025-11-25)


### Bug Fixes

* docker image (#982) (03af4f8)

## 1.18.0 (2025-11-25)


### Features

* add markdown support to sticky notes (#971) (a4674a2)
* add sticky notes (#967) (6d38ebe)


### Bug Fixes

* add postgres array type support for import and export (#958) (68412f9)
* Add Transactional/Analytical database categorization tabs (#965) (07dc4ea)
* adjust relationship edge offset when cardinality is visible (#973) (0afa71e)
* clean vulnerabilities (#981) (9a36e5e)
* dbml with notes (#968) (973b766)
* disable dragging on edit node content (#972) (69d4e8d)
* note markdown empty note (#974) (c8b8277)
* note markdown empty note (#975) (9baecea)
* notes colors (#970) (4fd940a)
* notes with readonly (#969) (3d85bcc)
* preserve MySQL column notes in DBML export (#979) (39eebe5)

## 1.17.0 (2025-10-27)


### Features

* create relationships on canvas modal (#946) (34475ad)


### Bug Fixes

* add auto-increment field detection in smart-query import (#935) (57b3b87)
* add open table in editor from canvas edit (#952) (7d811de)
* add rels export dbml (#937) (c3c646b)
* add support for arrays (#949) (49328d8)
* add support for parsing default values in DBML (#948) (459698b)
* add timestampz and int as datatypes to postgres (#940) (b15bc94)
* auto-enter edit mode when creating new tables from canvas (#943) (bcd8aa9)
* dbml diff fields types preview (#934) (bb03309)
* exit table edit on area click (#945) (38fedce)
* import array fields (#961) (91e713c)
* manipulate schema directly from the canvas (#947) (7ad0e77)
* preserve multi-word types in DBML export/import (#956) (9ed27cf)
* prevent text input glitch when editing table field names (#944) (498655e)
* resolve canvas filter tree state issues (#953) (ccb29e0)
* resolve dbml increment & nullable attributes issue (#954) (2c4b344)
* show SQL Script option conditionally for databases without DDL support (#960) (acf6d4b)
* use flag for custom types (#951) (62dec48)

## 1.16.0 (2025-09-24)


### Features

* add area context menu and UI improvements (#918) (d09379e)
* add quick table mode on canvas (#915) (8954d89)
* add zoom navigation buttons to canvas filter for tables and areas (#903) (a0fb1ed)
* **import-db:** add DBML syntax to import database dialog (#768) (af3638d)


### Bug Fixes

* add areas width and height + table width to diff check (#931) (98f6edd)
* add diff x,y (#928) (e4c4a3b)
* add support for ALTER TABLE ADD COLUMN in PostgreSQL importer (#892) (ec6e46f)
* add tests for diff (#930) (47a7a73)
* dbml edit mode glitch (#925) (93d72a8)
* dbml export default time bug (#922) (bc82f9d)
* dbml export renaming fields bug (#921) (26dc299)
* **dbml:** export array fields without quotes (#911) (5e81c18)
* diff logic (#927) (1b8d51b)
* export dbml issues after upgrade version (#883) (07937a2)
* export sql + import metadata lib (#902) (ffddcdc)
* handle bidirectional relationships in DBML export (#924) (9991077)
* import dbml set pk field unique (#920) (d6ba4a4)
* improve SQL default value parsing for PostgreSQL, MySQL, and SQL Server with proper type handling and casting support (#900) (fe9ef27)
* move area utils (#932) (2dc1a6f)
* move auto arrange to toolbar (#904) (b016a70)
* remove general db creation (#901) (df89f0b)
* remove many to many rel option (#933) (c567c0a)
* reset increment and default when change field (#896) (e5e1d59)
* **sql-import:** handle SQL Server DDL with multiple tables, inline foreign keys, and case-insensitive field matching (#897) (2a64dee)
* **sql-import:** support ALTER TABLE ALTER COLUMN TYPE in PostgreSQL importer (#895) (aa29061)
* **sqlite:** improve parser to handle tables without column types and fix column detection (#914) (d3dbf41)
* trigger edit table on canvas from context menu (#919) (bdc41c0)
* update deps vulns (#909) (2bd9ca2)
* upgrade dbml lib (#880) (d8e0bc7)

## 1.15.1 (2025-08-27)


### Bug Fixes

* add actions menu to diagram list + add duplicate diagram (#876) (abd2a6c)
* **custom-types:** Make schema optional (#866) (60c5675)
* handle quoted identifiers with special characters in SQL import/export and DBML generation (#877) (66b0863)

## 1.15.0 (2025-08-26)


### Features

* add auto increment support for fields with database-specific export (#851) (c77c983)
* **filter:** filter tables by areas (#836) (e9c5442)
* include foreign keys inline in SQLite CREATE TABLE statements (#833) (43fc1d7)
* **postgres:** add support hash index types (#812) (0d623a8)
* support create views (#868) (0a5874a)


### Bug Fixes

* area filter logic (#861) (73daf0d)
* **area filter:** fix dragging tables over filtered areas (#842) (19fd94c)
* **canvas:** delete table + area together bug (#859) (b697e26)
* **cla:** Harden action (#867) (ad8e344)
* DBML export error with multi-line table comments for SQL Server (#852) (0545b41)
* filter to default schema on load new diagram (#849) (712bdf5)
* **filter:** filter toggle issues with no schemas dbs (#856) (d0dee84)
* **filters:** refactor diagram filters - remove schema filter (#832) (4f1d329)
* for sqlite import - add more types & include type parameters (#834) (5936500)
* improve creating view to table dependency (#874) (44be48f)
* initially show filter when filter active (#853) (ab4845c)
* **menu:** clear file menu (#843) (eaebe34)
* merge relationship & dependency sections to ref section (#870) (ec3719e)
* move dbml into sections menu (#862) (2531a70)
* open filter by default (#863) (7e0fdd1)
* preserve composite primary key constraint names across import/export workflows (#869) (215d579)
* prevent false change detection in DBML editor by stripping public schema on import (#858) (0aaa451)
* remove unnecessary space (#845) (f1a4298)
* reorder with areas (#846) (d7c9536)
* **select-box:** fix select box issue in dialog (#840) (cb2ba66)
* set default filter only if has more than 1 schemas (#855) (b4ccfcd)
* show default schema first (#854) (1759b0b)
* **sidebar:** add titles to sidebar (#844) (b8f2141)
* **sql-import:** fix SQL Server foreign key parsing for tables without schema prefix (#857) (04d91c6)
* **table colors:** switch to default table color (#841) (0da3cae)
* update filter on adding table (#838) (41ba251)

## 1.14.0 (2025-08-04)


### Features

* add floating "Show All" button when tables are out of view (#787) (bda150d)
* add table selection for large database imports (#776) (0d9f57a)
* **canvas:** Add filter tables on canvas (#774) (dfbcf05)
* **custom-types:** add highlight fields option for custom types (#726) (7e0483f)
* **datatypes:** Add decimal / numeric attribute support + organize field row (#715) (778f85d)
* **dbml:** Edit Diagram Directly from DBML (#819) (1b0390f)
* **default value:** add default value option to table field settings (#770) (c9ea7da)
* enhance primary key and unique field handling logic (#817) (39247b7)
* implement area grouping with parent-child relationships (#762) (b35e175)
* **schema:** support create new schema (#801) (867903c)


### Bug Fixes

* add open and create diagram to side menu (#757) (67f5ac3)
* add PostgreSQL tests and fix parsing SQL (#760) (5d33740)
* area resizers size (#830) (23e93bf)
* **area:** redo/undo after dragging an area with tables (#767) (6af94af)
* **canvas filter:** improve scroller on canvas filter (#799) (6bea827)
* **canvas:** fix filter eye button (#780) (b7dbe54)
* clone of custom types (#804) (b30162d)
* **cockroachdb:** support schema creation for cockroachdb (#803) (dba372d)
* **dbml actions:** set dbml tooltips side (#798) (a119854)
* **dbml editor:** move tooltips button to be on the right (#797) (bfbfd7b)
* **dbml export:** fix handle tables with same name under different schemas (#807) (18e9142)
* **dbml export:** handle tables with same name under different schemas (#806) (e68837a)
* **dbml field comments:** support export field comments in dbml (#796) (0ca7008)
* **dbml import:** fix dbml import types + schemas (#808) (00bd535)
* **dbml-export:** merge field attributes into single brackets and fix schema syntax (#790) (309ee9c)
* **dbml-import:** handle unsupported DBML features and add comprehensive tests (#766) (22d46e1)
* **dbml:** dbml indentation (#829) (16f9f46)
* **dbml:** dbml note syntax (#826) (337f7cd)
* **dbml:** fix dbml output format (#815) (eed104b)
* **dbml:** fix schemas with same table names (#828) (0c300e5)
* **dbml:** import dbml notes (table + fields) (#827) (b9a1e78)
* **dbml:** support multiple relationships on same field in inline DBML (#822) (a5f8e56)
* **dbml:** support spaces in names (#794) (8f27f10)
* fix hotkeys on form elements (#778) (43d1dff)
* fix screen freeze after schema select (#800) (8aeb1df)
* **i18n:** add Croatian (hr) language support (#802) (2eb48e7)
* improve SQL export formatting and add schema-aware FK grouping (#783) (6df588f)
* lost in canvas button animation (#793) (a93ec2c)
* **readonly:** fix zoom out on readonly (#818) (8ffde62)
* remove error lag after autofix (#764) (bf32c08)
* remove unnecessary import (#791) (87836e5)
* **scroll:** disable scroll x behavior (#795) (4bc71c5)
* set focus on filter search (#775) (9949a46)
* solve issue with multiple render of tables (#823) (0c7eaa2)
* **sql-export:** escape newlines and quotes in multi-line comments (#765) (f7f9290)
* **sql-server:** improvment for sql-server import via sql script (#789) (79b8855)
* **table-node:** fix comment icon on field (#786) (745bdee)
* **table-node:** improve field spacing (#785) (08eb9cc)
* **table-select:** add loading indication for import (#782) (b46ed58)
* **ui:** reduce spacing between primary key icon and short field types (#816) (984b2ae)
* update MariaDB database import smart query (#792) (386e40a)
* update multiple schemas toast to require user action (#771) (f56fab9)
* update relationship when table width changes via expand/shrink (#825) (bc52933)

## 1.13.2 (2025-07-06)


### Bug Fixes

* add DISABLE_ANALYTICS flag to opt-out of Fathom analytics (#750) (aa0b629)

## 1.13.1 (2025-07-04)


### Bug Fixes

* **custom_types:** fix display custom types in select box (#737) (24be28a)
* **dbml-editor:** for some cases that the dbml had issues (#739) (e0ff198)
* **dbml:** Filter duplicate tables at diagram level before export dbml (#746) (d429128)
* **export-sql:** conditionally show generic option and reorder by diagram type (#708) (c6118e0)
* general performance improvements on canvas (#751) (4fcc49d)
* **import-database:** for custom types query to import supabase & timescale (#745) (2fce832)
* **import-db:** fix mariadb import (#740) (7d063b9)
* **performance:** improve storage provider performance (#734) (c6788b4)
* resolve unresponsive cursor and input glitches when editing field comments (#749) (d15985e)
* **table name:** updates table name value when its updated from canvas/sidebar (#716) (8b86e1c)

## 1.13.0 (2025-05-28)


### Features

* **custom-types:** add enums and composite types for Postgres (#714) (c3904d9)
* **export-sql:** add custom types to export sql script (#720) (cad155e)
* **oracle:** support oracle in SchemaFlow (#709) (765a1c4)


### Bug Fixes

* **canvas:** prevent canvas blink and lag on field edit (#723) (cd44346)
* **canvas:** prevent canvas blink and lag on primary field edit (#725) (4477b1c)
* **custom_types:** fix custom types on storage provider (#721) (beb0151)
* **custom_types:** fix custom types on storage provider (#722) (18012dd)
* **custom-types:** fetch directly via the smart-query the custom types (#729) (cf1e141)
* **dbml-editor:** export comments with schema if existsed (#728) (73f542a)
* **dbml-editor:** fix export dbml - to show enums (#724) (3894a22)
* **import-database:** remove the default fetch from import database (#718) (0d11b0c)
* **menu:** add oracle to import menu (#713) (aee5779)
* **relationship:** fix creating of relationships (#732) (08b627c)

## 1.12.0 (2025-05-20)


### Features

* **areas:** implement area to enable logical diagram arrangement (#661) (92e3ec7)
* **examples:** update examples to have areas (#677) (21c9129)
* **image-export:** add transparent and pattern export image toggles (#671) (6b8d637)


### Bug Fixes

* add sorting based on how common the datatype on side-panel (#651) (3a1b8d1)
* **canvas:** disable edit area name on read only (#666) (9402822)
* **canvas:** read only mode (#665) (651fe36)
* **clone:** add areas to clone diagram (#664) (aee1713)
* **dbml-editor:** add inline refs mode + fix issues with DBML syntax (#687) (fbf2fe9)
* **dbml-editor:** remove invalid fields before showing DBML + warning (#683) (5759241)
* **ddl-import:** fix datatypes when importing via ddl (#696) (a1144bb)
* **ddl:** inline fks ddl script (#701) (5849e45)
* **dependencies:** hide icon when diagram has no dependencies (#684) (547149d)
* **examples:** add loader (#678) (90a20dd)
* **examples:** fix clone examples (#679) (1778abb)
* **expanded-table:** persist expanded state across renders (#707) (54d5e96)
* **export image:** Fix usage of advanced options accordion (#703) (0ce85cf)
* **import-database:** auto detect when user try to import ddl script (#698) (5a5e64a)
* **import-database:** remove view_definition when importing via query (#702) (481ad3c)
* **import-json:** for broken json imports (#697) (2368e0d)
* **import-json:** simplify import script for fixing invalid JSON (#681) (226e6cf)
* **import:** dbml and query - senetize before import (#699) (34c0a71)
* **navbar:** open diagram directly from diagram icon (#694) (7db86dc)
* **performance:** Only render visible (#672) (83c4333)
* **performance:** update field only when changed (#685) (d3ddf7c)
* **postgres:** fix import of postgres fks (#700) (89e3cea)
* **schema:** add areas to diagram schema (#663) (ecfa148)
* **sql-script:** change ddl to be sql-script (#710) (487fb2d)
* **table:** enhance field focus behavior to include table hover state (#676) (19d2d0b)
* **translations:** Add some translations for ru-RU language (#690) (97d01d7)

## 1.11.0 (2025-04-17)


### Features

* add sidebar footer help buttons (#650) (fc46cbb)
* **import-sql:** import postgresql via SQL (DDL script) (#639) (f7a6e0c)


### Bug Fixes

* **import:** display query result formatted (#644) (caa81c2)
* **import:** strict parse of database metadata (#635) (0940d72)
* **mobile:** fix create diagram modal on mobile (#646) (25c4b42)
* **mysql-ddl:** update the script to import - for create fks (#642) (cf81253)
* **performance:** Import deps dynamically (#652) (e3cb627)
* remove unused links from help menu (#623) (85275e5)
* **sidebar:** turn sidebar to responsive for mobile (#658) (ce2389f)

## 1.10.0 (2025-03-25)


### Features

* **cloudflare-d1:** add support to cloudflare-d1 + wrangler cli (#632) (794f226)


### Bug Fixes

* **dbml-editor:** dealing with dbml editor for non-generic db-type (#624) (14de30b)
* **export-sql:** move from AI sql-export for MySQL&MariaDB to deterministic script (#628) (2fbf347)
* **export-sql:** move from AI sql-export for postgres to deterministic script (#626) (18f228c)
* **export-sql:** move from AI sql-export for sqlite to deterministic script (#627) (897ac60)
* **sidebar:** add sidebar for diagram objects (#618) (63b5ba0)
* **sidebar:** opens sidepanel in case its closed and click on sidebar (#620) (3faa39e)

## 1.9.0 (2025-03-13)


### Features

* **canvas:** highlight the Show-All button when No-Tables are visible in the canvas (#612) (62beb68)
* **chart max length:** add support for edit char max length (#613) (09b1275)
* **chart max length:** enable edit length from data type select box (#616) (bd67ccf)


### Bug Fixes

* **cardinality:** set true as default (#583) (2939320)
* **performance:** Optimize performance of field comments editing (#610) (5dd7fe7)
* remove Buckle dialog (#617) (502472b)
* **shorcuts:** add shortcut to toggle the theme (#602) (a643852)

## 1.8.1 (2025-03-02)


### Bug Fixes

* **add-docs:** add link to SchemaFlow documentation (#597) (b55d631)
* components config (#591) (cbc4e85)
* **docker config:** Environment Variable Handling and Configuration Logic (#605) (d6919f3)
* **empty-state:** show diff buttons on import-dbml when triggered by empty (#574) (4834247)
* **i18n:** add [FR] translation (#579) (ab89bad)
* **img-export:** add SchemaFlow watermark to exported image (#588) (b935b7f)
* **import-mssql:** fix import/export scripts to handle data correctly (#598) (e06eb2a)
* **menu-backup:** update export to be backup (#590) (26a0a5b)
* open create new diagram when there is no diagram (#594) (ef11892)
* **open diagram:** in case there is no diagram, opens the dialog (#593) (68f4819)
* **side-panel:** simplify how to add field and index (#573) (a1c0cf1)
* **sql_server_export:** use sql server export (#600) (56382a9)
* **sqlite-import:** import nuallable columns correctly + add json type (#571) (deb2184)

## 1.8.0 (2025-02-13)


### Features

* **dbml-import:** add error highlighting for dbml imports (#556) (190e4f4)
* **docker image:** add support for custom inference servers (#543) (1878083)


### Bug Fixes

* **canvas:** add right-click option to create relationships (#568) (e993f15)
* **canvas:** locate table from canvas (#560) (dc404c9)
* **docker:** add option to hide popups (#580) (a96c2e1)
* **export-sql:** show create script for only filtered schemas (#570) (85fd14f)
* **i18n:** fix Ukrainian (#554) (7b62719)
* **import dbml:** add import for indexes (#566) (0db67ea)
* **import-query:** improve the cleanup for messy json input (#562) (93d59f8)
* **index unique:** extract unique toggle for faster editing (#559) (dd4324d)
* **mssql-import:** improve script readability by adding edition comment (#572) (be65328)
* **realtionships section:** add the schema to source/target tables (#561) (b9e621b)
* **sqlserver-import:** open ssms guide when max chars (#565) (9c485b3)
* **table actions:** fix size of table actions (#578) (26d95ee)

## 1.7.0 (2025-02-03)


### Features

* **dbml-editor:** add dbml editor in side pannel (#534) (88be6c1)
* **import-dbml:** add import dbml functionality (#549) (b424518)


### Bug Fixes

* **canvas edit:** add option to edit names in canvas (#536) (0dcc9b9)
* **dbml-editor:** add shortcuts to dbml and filter: #534 (#535) (3b3be08)
* **dbml:** add error handling (#545) (fef6d3f)
* **empty-state:** fix dark-mode for empty-state (#547) (99a8201)
* **examples:** fix employee example dbml (#544) (2118bce)
* **i18n:** translation/Ukrainian (#529) (ff3269e)
* **open-diagram:** add arrow keys navigation in open diagram dialog (#537) (14f11c2)
* **performance:** fix bundle size (#551) (4c93326)
* **performance:** reduce bundle size (#553) (004d530)
* **performance:** resolve error on startup (#552) (fd2cc9f)
* **psql-import:** remove typo for import command (psql) (#546) (eb9b41e)
* **scroll:** fix scroll area (#550) (ef3d7a8)

## 1.6.1 (2025-01-26)


### Bug Fixes

* change empty state image (#531) (42d4cba)
* **chat-type:** remove typo of char datatype in examples (#530) (58231c9)
* **empty_state:** customize empty state (#533) (1643e7b)
* **Image Export:** importing css rules error while download image (#524) (e9e2736)
* **shortcuts:** add zoom all shortcut (#528) (7452ca6)
* **filter-tables:** show clean filter if no-results (#532) (c36cd33)

## 1.6.0 (2025-01-02)


### Features

* **view-menu:** add toggle for mini map visibility (#496) (#505) (8abf2a7)


### Bug Fixes

* add loadDiagramFromData logic to schemaflow provider (#513) (ee659ea)
* **dependency:** upgrade react query to v7 - clean console warnings (#504) (7c5db08)
* **i18n:** translation/Arabic (#509) (4b43f72)

## 1.5.1 (2024-12-15)


### Bug Fixes

* **export:** fix SQL server field.nullable type to boolean (#486) (a151f56)
* **readme:** Update README.md - add CockroachDB (#482) (2b6b733)

## 1.5.0 (2024-12-11)


### Features

* **CockroachDB:** Add CockroachDB support (#472) (5409288)
* **i18n:** translate share and dialog sections in Indonesian locale files (#468) (3574cec)


### Bug Fixes

* **core:** fix update diagram id (#477) (348f805)
* **dialogs:** fix footer position on dialogs (#470) (2309306)
* **sql-server import:** nullable should be boolean instead of string (#480) (635fb53)

## 1.4.0 (2024-12-02)


### Features

* **add templates:** add six more templates  (#452) (be1b109)
* **add templates:** add six more templates (django-axes, laravel-activitylog, octobox, pay-rails, pixelfed, polr) (#460) (03772f6)
* **add templates:** add six more templates (reversion, screeenly, staytus, deployer, devise, talk) (#457) (ddeef3b)
* **clickhouse:** add ClickHouse support (#463) (807cd22)
* **i18n:** Added bangla translations (#432) (885eb71)
* **side-panel:** Add functionality of order tables by drag & drop (#425) (a0e966b)


### Bug Fixes

* **clipboard:** defensive for navigator clipboard (#462) (5fc10a7)
* **import-database:** update database type after importing into an existing generic diagra (#456) (a8fe491)
* **Last Saved:** Translate the "last saved" relative date message (#400) (d45677e)
* **mariadb-types:** Add uuid data type (#459) (94656ec)
* window type (#454) (9c7d03c)

## 1.3.1 (2024-11-26)


### Bug Fixes

* **docker:** make OPENAI_API_KEY optional in docker run (#448) (4bb4766)

## 1.3.0 (2024-11-25)


### Features

* **side panel:** collapsible side panel on desktop view + keyboard shortcut (#439) (70f545f)


### Bug Fixes

* **dialogs:** fix height of dialogs for small screens (#440) (667685e)
* **drawer:** set fix min size (#429) (c5e0ea6)
* **export-sql:** add unique to export script (#422) (b75c6fe)
* fix layout warnings (#434) (94ec43b)
* **i18n:** add bahasa indonesia translation (#331) (ab07da0)
* **i18n:** add missing type to vi.ts (#444) (e77ee60)
* **i18n:** Add Telugu Language (#352) (8749591)
* **i18n:** add Turkish translations (#315) (d9fcbee)
* **i18n:** add Vietnamese translations (#435) (6c65c2e)
* **i18n:** Translating to Gujarati language (#433) (2940431)
* **i18n:** Translation of the export error into Russian (#418) (7c3c628)
* **i18n:** update korean for 1.2.0 (#419) (8397bef)
* **import script:** remove double quotes (#442) (fb702c8)
* **share:** fix export to handle broken indexes & relationships (#416) (4be3592)
* **templates:** add Five more templates (bouncer, cabot, feedbin, Pythonic, flarum, freescout) (#441) (eaa0678)

## 1.2.0 (2024-11-17)


### Features

* **duplicate table:** duplicate table from the canvas and sidebar (#404) (44cf5ca)


### Bug Fixes

* **AI exports:** add cahching layer to SQL exports (#390) (e5dbbf2)
* **canvas:** fix auto zoom on diagram load (#395) (492c932)
* **dockerfile:** support SPA refresh to resolve nginx return 404 (#384) (eaf75ce)
* **docs:** update license reference (#403) (44d10c2)
* **export image:** Add support for displaying cardinality relationships + background (#407) (68474e7)
* **i18n:** add Nepali translations (#406) (e1e55c4)
* **i18n:** change language keeps selected language also after refreshing the page (#409) (f35f62f)
* **i18n:** Create Translations in Marathi language (#266) (c6f7ff7)
* **i18n:** fix language nav: close when lang selected, hide tooltip when lang selected (#411) (02aaabd)
* **templates:** add five more templates (Sylius, Monica, Attendize, SaaS Pegasus & BookStack) (#408) (0f67394)
* **templates:** add six more templates (ticketit, snipe-it, refinerycms, comfortable-mexican-sofa, buddypress, lobsters) (#402) (07d3745)
* **templates:** fix cloned indexes from a template (#398) (9f8500f)
* **templates:** fix tags urls (#405) (fe8b9f9)
* **templates:** tag urls lowercase to support browsers (#397) (959e540)

## 1.1.0 (2024-11-13)


### Features

* **add templates:** add five more templates (laravel, django, twitter… (#371) (20b3396)
* **canvas:** Added Snap to grid functionality. Toggle/hold shift to enable snap to grid. (#373) (6c7eb46)
* **share:** add sharing capabilities to import and export diagrams (#365) (94a5d84)


### Bug Fixes

* **bundle:** fix bundle size (#382) (4ca1832)
* **dockerfile:** support openai key in docker build (#366) (545e857)
* **i18n:** add korean (#362) (b305be8)
* **i18n:** Add simplified chinese (#385) (9f28933)
* **i18n:** Added Russian language (#376) (2c69b08)
* **i18n:** added traditional Chinese language translation (#356) (123f40f)
* **i18n:** Fixed part of RU lang introduced in #365 feat(share) (#380) (5508c1e)
* **i18n:** french translation update - share menu (#391) (e3129ce)
* **import json:** for Check Script Result, default with quotes (#358) (1430d2c)
* improve title name edit interaction (#367) (84e7591)
* **share:** add loader to the export (#381) (3609bfe)
* **sql export:** make loading for export interactive (#388) (125a39f)
* **templates:** change the template url to be database instead of db (#374) (f1d073d)
* **templates:** fix issue with double-clone on localhost (#394) (78c427f)

## 1.0.1 (2024-11-06)


### Bug Fixes

* **offline:** add support when running on isolated network (#359) (aa884b4)
* open default diagram after deleting current diagram (#350) (87a40cf)
* **select-box:** allow using tab & space to show choices (#336) (93f623a)
* **smart query:** import postgres FKs (#357) (acb736e)
* **templates:** add two more templates (Airbnb, Wordpress) (#317) (ebce882)
* **templates:** align database icon (#351) (efaddee)
* **template:** separator in case of empty url (#355) (180886c)
* **templates:** fetch templates data from router (#321) (d8a20eb)

## 1.0.0 (2024-11-04)


### Features

* ability to change zoom or pan on scroll in the canvas component (ac208c4)
* add import logic based on the JSON input (01f4e4b)
* add import logic based on the JSON input (939ac22)
* add release (ac37475)
* add release (80491ae)
* Added darkmode support, user and system preferences (d63700f)
* added japanese language translation (#235) (588543f)
* change the menu to activate/deactive zoom on scroll (a69b241)
* disable darkmode toggle until colors are fixed, remove class from create (e2029da)
* **fetcher:** add pg magic sql (f74f208)
* improve dockerfile (48a0f4f)


### Bug Fixes

* :bug: pk_column changed to column in sqlite (f85a2d0)
* add contents permissions (b896134)
* add permissions (16a6166)
* add reference_schema to support again import with FKs (ce8ef57)
* add reference_schema to support again import with FKs all dbs (4d34ade)
* add reference_schema to the postgres import script (48414da)
* add support to MySQL versions below 8.0 (f2f74ad)
* autofocus on mobile (d5cb3e5)
* change to on push (866f8f5)
* change to on push (60f0317)
* change to on push (07da6d0)
* change workflow name (3770703)
* change workflow name (3b4f256)
* ci (be04ac2)
* docker login (de8ca35)
* **i18n:** add missing German translations (#311) (b2c2045)
* permissions (f654418)
* permissions issue (e51f4d3)
* remove cache (9877dd3)
* remove cache (be62368)
* remove effective scroll action (1c6786b)
* remove multi platform build (90fe199)
* remove multi platform build (21e1a22)
* restrict relationship handle  on views (a1734eb)
* rounded table node (21b3c91)
* small update on mobile, add the word Saved (0a11b6f)
* support multi schemas when using import script in postgres (1eff951)
* tag (2bc8255)
* tag (00d1792)
* to support all postgres schemas and not only public (f203813)
* update import queries and fix bug for MySQL & MariaDB (89e0cdd)
* uses docker/build-push-action@v5 (4799d41)
* uses docker/build-push-action@v5 (7358c9c)
* when import MySQL database via smart query fix PKs import (dac6059)
* zoom in/out on scroll instead of panning (6a0bc30)
