# Istio Demo

Demo application from my NDC Sydney session on Service Meshes. The accompanying [slides are available here](https://bit.ly/ndcsydney). This application showcases some of the powerful capabilities that Istio supports such as traffic shadowing, outlier detection, fault injection and retry policies.

## Setup

### Install Kubernetes

If you are running windows then I recommend installing [Docker for Windows](https://docs.docker.com/docker-for-windows). Minikube is also a viable alternative but I found the Hyper-V driver to quite unstable.

Install the Kubernetes CLI. The kubectl package can be pulled down from [chocolatey](https://chocolatey.org/packages/kubernetes-cli) 

### Install Istio

Once we have a Follow the instructions for intalling Istio located on [the official site](https://istio.io/docs/setup/kubernetes/quick-start/). The services in this solution are not configured to support mutual TLS so apply demo.yaml rather than demo-auth.yaml.

### Build Service Containers

Build container images for each of the services. The Kubernetes manifest expects the following containers name;

- servicea:1.0.0
- serviceb:1.0.0
- servicec:1.0.0
- servicec:2.0.0
- servicec:3.0.0
- serviced:1.0.0

### Configure auto sidecar injection

Running the following command will result in all pods within the default namespace to have a sidecar proxy automatically injected. If you do not want this behavior then you can also manually created the injected configuration using the Istio CLI.

`kubectl label namespace default istio-injection=enabled`

### Deploy application to Kubernetes

Open a console window at the application root directory and run the following command: 

`kubectl apply -f lonely-services.yml`

Verify the application has been deployed successfully.

`kubectl get po`

You should see pods for each of the services. Each pod should comprise two containers, the service istself and the injected istio proxy.

### Configure Istio Gateway

Run the following command to configure the Istio gateway for this application:

`kubectl apply -f lonely-services-gateway`


