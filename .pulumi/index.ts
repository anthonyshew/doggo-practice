import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as docker from '@pulumi/docker'

// Create a docker repository.
const repo = new awsx.ecr.Repository("my-repo");

// const imageeeeeee = new awsx.ecr.Image("image", {
//     repositoryUrl: repo.url,
//     path: "./app",
// })

const image = awsx.ecr.buildAndPushImage("name", {
  context:  "..",
  dockerfile: "../apps/web/Dockerfile"
})

const cluster = new awsx.ecs.Cluster("default-cluster")

const lb = new awsx.lb.ApplicationLoadBalancer("nginx-lb")

const service = new awsx.ecs.FargateService('my-service', {
  cluster,
  taskDefinitionArgs: {
    container: {
      image: image,
    }
  }

})

export const lbDns = lb.loadBalancer.dnsName