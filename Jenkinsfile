pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'  
        FRONTEND_TAG = 'frontend5'
        BACKEND_TAG = 'backend5'
        DOCKERHUB_USERNAME = 'omarismail0'            
        DOCKERHUB_REPOSITORY = 'kubernetes-project'           
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


        // stage('Build Frontend Image') {
        //     steps {
        //         dir('frontend'){
        //             script {
        //                 docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}")
        //                 docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
        //                     docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}").push("${FRONTEND_TAG}")
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Build Backend Image') {
        //     steps {
        //         dir('backend') {
        //             script {
        //                 docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${BACKEND_TAG}")
        //                 docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
        //                     docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${BACKEND_TAG}").push("${BACKEND_TAG}")
        //                 }
        //             }
        //         }
        //     }
        // }

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
                kubectl apply -f k8s/FrontendIngress.yaml --validate=false
                kubectl apply -f k8s/BackendIngress.yaml --validate=false
                '''
            }
        }

        // stage('Apply Kubernetes Volumes') {
        //     steps {
        //         sh '''
        //         set -e
        //         export KUBECONFIG=~/jenkins_home/.kube/config
        //         kubectl create -f k8s/presistent_volume.yml --validate=false
        //         kubectl create -f k8s/presistent_volume_claim.yml --validate=false
        //         '''
        //     }
        // }


        // stage("ingress service"){
        //     steps{
        //         sh '''
        //         set -e
        //         export KUBECONFIG=~/jenkins_home/.kube/config
        //         kubectl create ingress front-localhost --class=nginx \
        //         --rule="front.localdev.me/*=frontend-app:80"

        //         echo "Starting port forwarding for frontend..."
        //         kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8090:80 &

        //         kubectl create ingress server-localhost --class=nginx \
        //         --rule="server.localdev.me/*=node-app:5000"   

        //         echo "Starting port forwarding for backend..."
        //         kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8089:80 &
        //         '''
        //     }
        // }
    }
}
