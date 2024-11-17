pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'  
        FRONTEND_TAG = 'frontend2'
        BACKEND_TAG = 'back-end'
        DOCKERHUB_USERNAME = 'omarismail0'            
        DOCKERHUB_REPOSITORY = 'kubernetes-project'   
        KUBECONFIG = '/root/.kube/config'           
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

        stage('Apply Kubernetes Manifests') {
            steps {
                sh '''
                set -e
                export KUBECONFIG=/root/.kube/config
                kubectl apply -f k8s/FrontendDeployment.yaml
                kubectl apply -f k8s/BackendDeployment.yaml
                kubectl apply -f k8s/nodeDeployment.yaml
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
