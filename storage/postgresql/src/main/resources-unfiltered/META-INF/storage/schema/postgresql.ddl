-- *********************************************************************
-- DDL for the Apicurio API Designer - Database: PostgreSQL
-- *********************************************************************

CREATE TABLE apicurio ("key" VARCHAR(255) NOT NULL, "value" VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY ("key");

CREATE TABLE sequences (tenantId VARCHAR(128) NOT NULL, "key" VARCHAR(32) NOT NULL, "value" BIGINT NOT NULL);
ALTER TABLE sequences ADD PRIMARY KEY (tenantId, "key");

CREATE TABLE designs (tenantId VARCHAR(128) NOT NULL, designId VARCHAR(128) NOT NULL, contentId BIGINT NOT NULL);
ALTER TABLE designs ADD PRIMARY KEY (tenantId, designId);

CREATE TABLE content (tenantId VARCHAR(128) NOT NULL, contentId BIGINT NOT NULL, contentHash VARCHAR(64) NOT NULL, content BYTEA NOT NULL);
ALTER TABLE content ADD PRIMARY KEY (tenantId, contentId);

CREATE TABLE design_metadata (tenantId VARCHAR(128) NOT NULL, designId VARCHAR(128) NOT NULL, name VARCHAR(512), description VARCHAR(1024), createdBy VARCHAR(256), createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, modifiedBy VARCHAR(256), modifiedOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, type VARCHAR(128), origin VARCHAR(128));
ALTER TABLE design_metadata ADD PRIMARY KEY (tenantId, designId);

CREATE TABLE design_events (tenantId VARCHAR(128) NOT NULL, eventId VARCHAR(128) NOT NULL, designId VARCHAR(128) NOT NULL, createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, type VARCHAR(128), data BYTEA NOT NULL);
ALTER TABLE design_events ADD PRIMARY KEY (tenantId, eventId);

CREATE TABLE tenants (tenantId VARCHAR(128) NOT NULL, orgId VARCHAR(128) NOT NULL);
ALTER TABLE tenants ADD PRIMARY KEY (tenantId);
