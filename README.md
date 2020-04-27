# Ignite API

- Author: **Michael Palmer**
- Version: `0.1.0-dev.0`

# Overview

**Ignite** is designed to provide Webhook functionality for a range of applications and services, it works by efficently collecting a list of subscribers and processing them in batches of 10, then 1 until every subscriber has received a notification.

## Concepts

- **Queue**
- **Job**
- **Hook**

## Security

In order to provide applications with an extra layer of validation, the value obtained by the `secret` property of the `/hook` creation will be assigned to a `X-Ignite-Signature` after being hashed, the algorithm used for hashing will be connected using the following format: `sha1-{secret}`.

After the notification has been received (and verified), we ask developers to send back a new `secret` that will be updated for that **Hook**, this ensures each signature is only used once and prevents attackers obtaining this information and spoofing it.

- _we'll detail more about our security processes as they're implemented_

## Testing

In order to run tests, `yarn test` is used. This command will _only_ run unit tests, integration or end-to-end testing requires an active **MongoDB** connection specified using the `IGNITE_MONGO_URL` environment variable.

All CI/CD tools should run both `yarn test` and `yarn test:e2e`, although an active connection will be required for the latter.

## Database

As of `0.1.0-dev.0`, created **Events** aren't currently stored by the application, they're simply added to the queue and begin the webhook invoking process and begin sending outbound **POST** requests.

Although the **Events** aren't stored inside a database, they do live for a short period of time within **Redis**, this is due to the **Queue** system we've implemented using **Redis**, however we'll likely extend this support to deliver **Events** history for short time periods.

## Hooks

A **Hook** is stored inside **MongoDB**, **Hooks** will also be cached using **Redis** to reduce the amount of database operations.
