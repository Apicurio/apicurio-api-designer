package io.apicurio.designer.spi.storage.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class DesignMetadataDto {

    String id;

    String name;

    String description;

    String type;

    String source;

    Instant createdOn;

    String createdBy;

    Instant modifiedOn;

    String modifiedBy;
}
