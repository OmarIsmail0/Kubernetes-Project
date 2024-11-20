pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'  
        FRONTEND_TAG = 'frontend2'
        BACKEND_TAG = 'back-end'
        DOCKERHUB_USERNAME = 'omarismail0'            
        DOCKERHUB_REPOSITORY = 'kubernetes-project'   
        KUBECONFIG = '/root/.kube/config'     
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

         
        stage('Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', 
                                                    usernameVariable: 'DOCKER_USERNAME', 
                                                    passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin $DOCKER_REGISTRY
                        """
                    }
                }
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
                export KUBECONFIG=~/.kube/config
                kubectl version --client
                '''
            }
        }

        stage('Apply Kubernetes Manifests') {
            steps {
                sh '''
                set -e
                export KUBECONFIG=~/.kube/config
                sudo kubectl apply -f k8s/FrontendDeployment.yaml 
                sudo kubectl apply -f k8s/BackendDeployment.yaml 
                sudo kubectl apply -f k8s/mongo-k8s.yml 
                kubectl apply -f k8s/presistent_volume.yml
                kubectl apply -f k8s/presistent_volume_claim.yml
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
