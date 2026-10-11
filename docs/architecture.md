\# ☁️ ContainerCloud — AWS Architecture Documentation



\## 📌 1. Overview



ContainerCloud is a containerized web application that uses \*\*React\*\* for the frontend and \*\*Python Flask\*\* for the backend. Both components are packaged as Docker images and deployed as separate services on \*\*Amazon ECS using AWS Fargate\*\*.



Amazon ECR stores the container images, and an Application Load Balancer provides the public entry point for the application.



The architecture separates the user interface from backend API processing, making each component easier to deploy, troubleshoot, and maintain.



\## 🏗️ 2. Architecture Diagram



```mermaid

flowchart TD

&#x20;   User\["👤 User / Browser"]

&#x20;   ALB\["⚖️ Application Load Balancer<br/>HTTP :80"]

&#x20;   FrontTG\["🎯 Frontend Target Group"]

&#x20;   BackTG\["🎯 Backend Target Group"]

&#x20;   Front\["🌐 React + Nginx Container"]

&#x20;   Back\["🐍 Flask API Container"]

&#x20;   ECRFront\["📦 Amazon ECR<br/>Frontend Image"]

&#x20;   ECRBack\["📦 Amazon ECR<br/>Backend Image"]

&#x20;   ECS\["🐳 Amazon ECS Cluster"]

&#x20;   Fargate\["☁️ AWS Fargate"]

&#x20;   CW\["📊 Amazon CloudWatch Logs"]



&#x20;   User -->|HTTP port 80| ALB

&#x20;   ALB -->|Default route /| FrontTG

&#x20;   ALB -->|Path /api/\*| BackTG

&#x20;   FrontTG --> Front

&#x20;   BackTG --> Back

&#x20;   ECRFront -.->|Frontend image| ECS

&#x20;   ECRBack -.->|Backend image| ECS

&#x20;   ECS --> Fargate

&#x20;   Fargate --> Front

&#x20;   Fargate --> Back

&#x20;   Front -.->|Logs when configured| CW

&#x20;   Back -.->|Logs when configured| CW



&#x20;   classDef user fill:#E0F2FE,stroke:#0284C7,color:#0C4A6E

&#x20;   classDef routing fill:#FEF3C7,stroke:#D97706,color:#78350F

&#x20;   classDef container fill:#DCFCE7,stroke:#16A34A,color:#14532D

&#x20;   classDef registry fill:#F3E8FF,stroke:#9333EA,color:#581C87

&#x20;   classDef monitoring fill:#FCE7F3,stroke:#DB2777,color:#831843



&#x20;   class User user

&#x20;   class ALB,FrontTG,BackTG routing

&#x20;   class Front,Back,ECS,Fargate container

&#x20;   class ECRFront,ECRBack registry

&#x20;   class CW monitoring

```



> \*\*📝 Note:\*\* This diagram represents the intended deployment architecture. Confirm the current AWS resources, Fargate configuration, and logging settings before treating every connection as verified.



\## 🧩 3. Architecture Components



\### 👤 3.1 User / Browser



The user opens the public Application Load Balancer URL. The browser downloads the React application's HTML, CSS, and JavaScript assets from the frontend service.



The browser also sends API requests to the application's API paths.



\### ⚖️ 3.2 Application Load Balancer (ALB)



The Application Load Balancer operates at the application layer and accepts incoming HTTP requests.



\*\*Project configuration:\*\*



\* 🌐 DNS name: `containerized-flask-alb-1144142712.ap-south-1.elb.amazonaws.com`

\* 🔌 Listener: HTTP port 80

\* 📍 Region: `ap-south-1`



The listener routes requests according to their URL paths.



| Request       | Destination                              |

| ------------- | ---------------------------------------- |

| `/`           | Frontend target group                    |

| `/api/health` | Backend target group                     |

| `/api/\*`      | Backend target group                     |

| Other paths   | Depends on the configured listener rules |



🔎 Verify the actual listener rules in the AWS Console.



\### 🌐 3.3 Frontend Service



The frontend is built with React and Vite. During the production build, Vite generates static HTML, CSS, and JavaScript assets.



Nginx serves these assets inside the frontend Docker container.



\*\*Responsibilities:\*\*



\* 🖥️ Render the ContainerCloud dashboard.

\* 📊 Display frontend and backend status information.

\* 🩺 Provide the user interface for checking backend health.

\* 🔗 Send requests to backend API endpoints.



\### 🐍 3.4 Backend Service



The backend is developed using Python and Flask.



\*\*Responsibilities:\*\*



\* 🔌 Expose API endpoints.

\* 🩺 Respond to health-check requests.

\* 📄 Return JSON responses.

\* 📈 Provide a backend service that can be monitored independently from the frontend.



\*\*Health-check endpoint:\*\*



`/api/health`



\*\*Example response:\*\*



```json

{

&#x20; "application": "ContainerCloud",

&#x20; "status": "healthy"

}

```



\### 🐳 3.5 Docker



Docker packages each application component and its required runtime dependencies into a container image.



The project uses separate images for:



\* 🌐 \*\*Frontend:\*\* React production assets served by Nginx.

\* 🐍 \*\*Backend:\*\* Python Flask application.



This separation allows each component to be built and deployed independently.



\### 📦 3.6 Amazon Elastic Container Registry (ECR)



Amazon ECR is the private container image registry used to store Docker images.



\*\*Repositories:\*\*



\* `containerized-flask-frontend`

\* `containerized-flask-backend`



ECS tasks use the image references in their task definitions to retrieve the required images.



\### 🐳 3.7 Amazon Elastic Container Service (ECS)



Amazon ECS manages the containerized application services.



\*\*Cluster:\*\*



`containerized-flask-cluster`



\*\*Services:\*\*



\* `containerized-flask-frontend-service`

\* `containerized-flask-backend-service`



An ECS service maintains its configured number of tasks and supports controlled deployments.



\### ☁️ 3.8 AWS Fargate



AWS Fargate provides compute capacity for ECS tasks.



With Fargate, the project does not need to manage the underlying EC2 container hosts.



Task CPU, memory, networking, and scaling settings are controlled through ECS task definitions and service configuration.



\### 📊 3.9 Amazon CloudWatch Logs



CloudWatch Logs provides a centralized location for container logs when task definitions are configured with the appropriate logging driver.



\*\*Project log group:\*\*



`/ecs/containerized-flask-app`



Logs help diagnose container startup problems, application exceptions, and deployment failures.



\## 🔄 4. Request and Deployment Flow



\### 🌐 4.1 Loading the Dashboard



1\. 👤 The user opens the ALB DNS URL.

2\. ⚖️ The ALB listener receives the HTTP request.

3\. 🎯 The default listener rule forwards the request to the frontend target group.

4\. 🌐 The frontend container's Nginx server returns the React application assets.

5\. 🖥️ The browser loads and renders the dashboard.



\### 🩺 4.2 Checking Backend Health



1\. 🔗 The browser or frontend requests `/api/health`.

2\. ⚖️ The ALB matches the `/api/\*` listener rule.

3\. 🎯 The request is forwarded to the backend target group.

4\. 🐍 Flask processes the request.

5\. 📄 Flask returns a JSON response.

6\. 🔄 The response passes through the ALB to the client.



\### 🚀 4.3 Deploying a New Version



1\. 💻 Update the frontend or backend source code.

2\. 🐳 Build the relevant Docker image.

3\. 🏷️ Tag the image with its ECR repository URI.

4\. 📦 Push the image to ECR.

5\. 📝 Update the ECS task definition if the image reference changes.

6\. 🚀 Deploy the updated task definition or start a new deployment.

7\. 🩺 Check task status and target group health.

8\. 🌐 Test the application through the ALB URL.



\## 🔐 5. Network and Security Design



The ALB and ECS tasks communicate through their configured network interfaces and security groups.



\*\*Expected security principles:\*\*



\* 🔒 Public access should be limited to the ALB listener ports.

\* 🛡️ Frontend and backend container ports should not be exposed unnecessarily.

\* 🔗 Backend traffic should be permitted only from appropriate sources.

\* 🔑 ECS tasks should use appropriate IAM roles to pull images and publish logs.

\* 🔐 Secrets should be supplied securely rather than embedded in Docker images.

\* 🔒 HTTPS should be configured for production deployments.



🔎 Confirm the actual VPC, subnet, security group, and task networking configuration in AWS before documenting exact subnet IDs or public/private subnet assignments.



\## 🩺 6. Health Checks



Health checks help determine whether application targets can receive traffic.



\*\*Configured project paths:\*\*



\* 🌐 Frontend: `/`

\* 🐍 Backend: `/api/health`



Verify the health-check paths, ports, intervals, timeouts, and success codes in the target group configuration.



A successful health check does not guarantee that every application feature is working; it confirms only what the selected endpoint tests.



\## 📈 7. Availability and Scaling



Amazon ECS services can maintain multiple running tasks, and Fargate can run tasks without requiring EC2 host management.



The architecture can be extended to improve availability by:



\* 🌍 Running tasks across multiple Availability Zones.

\* 📈 Configuring ECS service auto scaling.

\* 🩺 Configuring suitable ALB health checks.

\* 🔄 Using deployment settings that support safe rollouts.

\* 📊 Monitoring errors and resource utilization through CloudWatch.



⚠️ Do not describe the application as highly available or automatically scaling unless those configurations have been verified in the deployed environment.



\## ✅ 8. Architecture Benefits



\### 🧩 Separation of Concerns



Frontend presentation and backend API processing run in different services.



\### 🔁 Repeatable Deployments



Docker images provide a consistent package for application deployment.



\### ☁️ Managed Container Compute



Fargate removes the need to manage the underlying container hosts.



\### ⚖️ Centralized Entry Point



The ALB provides one URL for users and routes requests to the appropriate service.



\### 🔍 Easier Troubleshooting



ECS service events, target group health checks, and CloudWatch Logs help identify operational issues.



\## 🛠️ 9. Known Limitations and Future Improvements



Possible improvements include:



\* 🔒 HTTPS using AWS Certificate Manager.

\* ⚙️ Automated CI/CD using GitHub Actions.

\* 🏷️ Versioned, immutable ECR image tags.

\* 🧪 Automated tests before deployment.

\* 📈 ECS service auto scaling.

\* 🚨 CloudWatch alarms and operational dashboards.

\* 🏗️ Infrastructure as code.

\* 🛡️ Stronger production security controls.



\## 🎯 10. Summary



ContainerCloud demonstrates the deployment of a React and Flask application using Docker, Amazon ECR, Amazon ECS, AWS Fargate, and an Application Load Balancer.



The architecture separates frontend and backend services, uses container images for deployment, and provides a common entry point for web and API requests. It also provides a foundation for further learning in CI/CD, observability, security, and container orchestration.



\*\*🚀 Key AWS Services Used:\*\* Amazon ECS • AWS Fargate • Amazon ECR • Application Load Balancer • Amazon CloudWatch • AWS IAM



