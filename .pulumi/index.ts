import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";

// Create a repository.
const repo = new awsx.ecr.Repository("my-repo");

export const repoUrl = repo.repository.repositoryUrl;
