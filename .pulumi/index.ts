import * as pulumi from '@pulumi/pulumi'
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as docker from '@pulumi/docker'

// Get the config for the stack.
const config = new pulumi.Config()

// Get the stack that we're running in.
const stack = pulumi.getStack()

let frontendContainer
let backendContainer

if (stack === "dev") {
  const frontendPort = config.requireNumber("frontend_port")
  const backendPort = config.requireNumber("backend_port")
  const nodeEnvironment = config.require("node_environment")
  const protocol = config.require("protocol")

  const backend = new docker.Image("backend", {
    imageName: "practice-backend",
    localImageName: "practice-backend",
    build: {
      context: "../",
      dockerfile: "../apps/api/Dockerfile"
    }
  })

  const frontend = new docker.Image("frontend", {
    imageName: "practice-frontend",
    localImageName: "practice-frontend",
    build: {
      context: "../",
      dockerfile: "../apps/web/Dockerfile"
    }
  })

  const network = new docker.Network("network", {
    name: `$services-${stack}`
  })

 backendContainer = new docker.Container("backendContainer", {
    name: `backend-${stack}`,
    image: backend.baseImageName,
    ports: [
        {
            internal: backendPort,
            external: backendPort,
        },
    ],
    envs: [
        `NODE_ENV=${nodeEnvironment}`,
    ],
    networksAdvanced: [
        {
            name: network.name,
        },
    ],
});


frontendContainer = new docker.Container("frontendContainer", {
    name: `frontend-${stack}`,
    image: frontend.baseImageName,
    ports: [
        {
            internal: frontendPort,
            external: frontendPort
        },
    ],
    envs: [
        `NODE_ENV=${nodeEnvironment}`,
    ],
    networksAdvanced: [
        {
            name: network.name,
        },
    ],
});
}

export const frontend = frontendContainer?.ports
export const backend = backendContainer?.ports

// BELOW HERE IS ME TRYING TO GET IT INTO THE CLOUD
// / Build an image and push it to the repository.
// const webImage = awsx.ecr.buildAndPushImage("doggo-practice-web", {
//   context:  "..",
//   dockerfile: "../apps/web/Dockerfile"
// })

// const apiImage = awsx.ecr.buildAndPushImage("doggo-practice-api", {
//   context:  "..",
//   dockerfile: "../apps/api/Dockerfile"
// })

// Set up an cluster for the containers to live in.
// const cluster = new awsx.ecs.Cluster("doggo-practice-cluster")

// Load balancing because we scale AF.
// const lb = new awsx.lb.ApplicationLoadBalancer("doggo-practice-lb")

// const fargate = new awsx.ecs.FargateService('doggo-practice', {
//   cluster,
//   taskDefinitionArgs: {
//     containers: {
//       web: {
//         image: awsx.ecs.Image.fromPath("doggo-practice-web", "../apps/web/Dockerfile"),
//         portMappings: [{
//           containerPort: 80,
//           hostPort: 80,
//         }]
//       },
//       api: {
//         image: awsx.ecs.Image.fromPath("doggo-practice-api", "../apps/api/Dockerfile"),
//         portMappings: [{
//           containerPort: 5000,
//           hostPort: 5000,
//         }]
//       }
//     },
//   },
// })

// Output the load balancer id to help myself find it.
// export const lbDns = lb.loadBalancer.id
// export const webOut = fargate.cluster