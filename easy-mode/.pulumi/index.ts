// The eventual target:
// https://docs.aws.amazon.com/whitepapers/latest/web-application-hosting-best-practices/an-aws-cloud-architecture-for-web-hosting.html

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const productName = "easy-mode";

const config = new pulumi.Config();
const stack = pulumi.getStack();

const bucket = new aws.s3.Bucket("my-app.trovabaseball.com", {
  bucket: "my-app.trovabaseball.com",
  acl: "public-read",
  website: {
    indexDocument: "index.html",
  },
});

const hostedZoneId = aws.route53
  .getZone({ name: "trovabaseball.com" }, { async: true })
  .then((zone) => zone.id);

const record = new aws.route53.Record("targetDomain", {
  name: "my-app.trovabaseball.com",
  zoneId: hostedZoneId,
  type: "A",
  aliases: [
    {
      zoneId: bucket.hostedZoneId,
      name: bucket.websiteDomain,
      evaluateTargetHealth: true,
    },
  ],
});

export const bucketName = bucket.id;
export const recordName = record.name;
