FROM postgres:14-alpine

# Install build dependencies
RUN apk add --no-cache \
    git \
    build-base \
    gcc \
    musl-dev \
    postgresql-dev \
    linux-headers

# Clone and build pgvector
RUN git clone --branch v0.4.4 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    CC=gcc make && \
    make install