package io.apicurio.designer.common.io.content;

/**
 * @author Ales Justin
 */
class BytesContentHandle extends AbstractContentHandle {

    BytesContentHandle(byte[] bytes) {
        this.bytes = bytes;
    }

    @Override
    public byte[] bytes() {
        return bytes;
    }
}
