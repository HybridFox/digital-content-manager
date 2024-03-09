FROM rust:1.76.0 as builder

# create a new empty shell project
# RUN USER=root cargo new --bin app
WORKDIR /app

# copy over your manifests
COPY apps/api/. /app/

RUN ls -al
# build for release
RUN cargo build --bins --release

RUN ldd /app/target/release/dcm-api

# our final base
FROM debian:bullseye-slim

RUN apt-get update && apt-get install libpq5 libssl-dev ca-certificates -y
COPY --from=builder /app/target/release/dcm-api /

# set the startup command to run your binary
CMD ["./dcm-api"]
