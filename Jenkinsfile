pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'  
        FRONTEND_TAG = 'frontend4'
        BACKEND_TAG = 'backend4'
        DOCKERHUB_USERNAME = 'omarismail0'            
        DOCKERHUB_REPOSITORY = 'kubernetes-project'   
        KUBECONFIG = '~/jenkins_home/.kube/config'     
        DOCKER_REGISTRY = 'https://index.docker.io/v1/' // Update for custom registries
        
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker Version') {
            steps {
                sh 'docker --version'  // Check if Docker is available
            }
        }


        stage('Build Frontend Image') {
            steps {
                dir('frontend'){
                    script {
                        docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}")
                        docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
                            docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}").push("${FRONTEND_TAG}")
                        }
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${BACKEND_TAG}")
                        docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
                            docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${BACKEND_TAG}").push("${BACKEND_TAG}")
                        }
                    }
                }
            }
        }

        stage('Test kubectl') {
            steps {
                sh '''
                export KUBECONFIG=~/jenkins_home/.kube/config
                kubectl version --client
                '''
            }
        }

        stage('Apply Kubernetes Manifests') {
            steps {
                sh '''
                set -e
                export KUBECONFIG=~/jenkins_home/.kube/config
                kubectl apply -f k8s/FrontendDeployment.yaml --validate=false
                kubectl apply -f k8s/BackendDeployment.yaml --validate=false
                kubectl apply -f k8s/mongo-k8s.yml --validate=false
                '''
            }
        }

        stage('Apply Kubernetes Volumes') {
            steps {
                sh '''
                set -e
                export KUBECONFIG=~/jenkins_home/.kube/config
                kubectl create -f k8s/presistent_volume.yml --validate=false
                kubectl create -f k8s/presistent_volume_claim.yml --validate=false
                '''
            }
        }


        stage("ingress service"){
            steps{
                sh '''
                set -e
                export KUBECONFIG=~/jenkins_home/.kube/config
                kubectl apply -f product-ingress.yaml
                kubectl apply -f server-ingress.yaml
                kubectl apply -f nodeport-service.yaml
                '''
            }
        }

    }
    post {
        always {
            cleanWs()
        }
    }
}
