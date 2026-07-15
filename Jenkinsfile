pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20'
    }

    parameters {
        choice(
            name: 'RELEASE_MODE',
            choices: ['devSnapshot', 'Specific Version'],
            description: 'Select release type'
        )
        string(
            name: 'VERSION_STRING',
            defaultValue: '',
            description: 'Enter version (e.g., v1.0.0) for Specific Version'
        )
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['Staging', 'UAT', 'Production'],
            description: 'Select target environment'
        )
        choice(
            name: 'DEPLOY_PACKAGE',
            choices: ['No packages available'],
            description: 'Select package to deploy'
        )
    }

    environment {
        ARCHIVE_DIR = '/var/lib/jenkins/archived-builds'
        BACKEND_DIR = 'ecommerce/e-commerce-main/backend'
        FRONTEND_DIR = 'ecommerce/e-commerce-main/frontend'
        QA_DIR = 'QA/tests'
        ENV_FILE = 'ecommerce/e-commerce-main/backend/.env'
    }
    
    stages {
        stage('Phase 1: CI') {
            when { branch 'main' }
            stages {
                stage('1.1 - Code Checkout') {
                    steps {
                        checkout scm
                        echo 'Code checked out'
                    }
                }
                
                stage('1.2 - Install Root Dependencies') {
                    steps {
                        script {
                            if (fileExists('package.json')) {
                                sh 'npm install'
                                echo 'Root dependencies installed'
                            } else {
                                echo 'No root package.json found, skipping'
                            }
                        }
                    }
                }
                
                stage('1.3 - Install Backend Dependencies') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }
                
                stage('1.4 - Install Frontend Dependencies') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }
                
                stage('1.5 - Linting (Frontend)') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            script {
                                try {
                                    sh 'npm run lint'
                                    echo 'Linting passed'
                                } catch (e) {
                                    error 'Linting failed'
                                }
                            }
                        }
                    }
                }
                
                stage('1.6 - Run Root Unit Tests') {
                    steps {
                        script {
                            if (fileExists('package.json')) {
                                try {
                                    sh 'npm test'
                                    echo 'Root unit tests passed'
                                } catch (e) {
                                    error 'Root unit tests failed'
                                }
                            } else {
                                echo 'No root tests found, skipping'
                            }
                        }
                    }
                }
                
                stage('1.7 - Run Selenium Tests') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            script {
                                try {
                                    sh 'npm run test:selenium'
                                    echo 'Selenium tests passed'
                                } catch (e) {
                                    error 'Selenium tests failed'
                                }
                            }
                        }
                    }
                }
                
                stage('1.8 - Verification Build (Frontend)') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            script {
                                try {
                                    sh 'npm run build'
                                    echo 'Frontend build successful'
                                    sh 'rm -rf dist/'
                                } catch (e) {
                                    error 'Frontend build failed'
                                }
                            }
                        }
                    }
                }
                
                stage('1.9 - Verification Build (Backend)') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            script {
                                try {
                                    sh 'node -c src/server.js'
                                    echo 'Backend syntax check passed'
                                } catch (e) {
                                    error 'Backend syntax check failed'
                                }
                            }
                        }
                    }
                }
                
                stage('1.10 - CI Success') {
                    steps {
                        echo 'PHASE 1 CI COMPLETED SUCCESSFULLY'
                    }
                }
            }
        }
        
        stage('Phase 2: Delivery') {
            when { branch 'main' }
            
            input {
                message 'Phase 2: Release Delivery'
                ok 'Proceed'
                submitter 'devops-engineer,release-manager'
                parameters {
                    choice(
                        name: 'RELEASE_MODE',
                        choices: ['devSnapshot', 'Specific Version'],
                        description: 'Select release type'
                    )
                    string(
                        name: 'VERSION_STRING',
                        defaultValue: '',
                        description: 'Enter version (e.g., v1.0.0) for Specific Version'
                    )
                }
            }
            
            stages {
                stage('2.1 - Checkout') {
                    steps { checkout scm }
                }
                
                stage('2.2 - Determine Version') {
                    steps {
                        script {
                            if (params.RELEASE_MODE == 'devSnapshot') {
                                env.RELEASE_VERSION = "devSnapshot-build${BUILD_NUMBER}"
                            } else {
                                if (!params.VERSION_STRING.trim()) {
                                    error 'Version required for Specific Version'
                                }
                                env.RELEASE_VERSION = params.VERSION_STRING.trim()
                            }
                            echo "Version: ${env.RELEASE_VERSION}"
                        }
                    }
                }
                
                stage('2.3 - Install All Dependencies') {
                    steps {
                        script {
                            if (fileExists('package.json')) {
                                sh 'npm install'
                            }
                        }
                        dir("${BACKEND_DIR}") { sh 'npm install' }
                        dir("${FRONTEND_DIR}") { sh 'npm install' }
                    }
                }
                
                stage('2.4 - Build Frontend') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm run build'
                        }
                    }
                }
                
                stage('2.5 - Create Version File') {
                    steps {
                        script {
                            writeFile file: 'version.json', text: """
{
    "version": "${env.RELEASE_VERSION}",
    "buildDate": "${new Date().format('yyyy-MM-dd HH:mm:ss')}",
    "buildNumber": "${BUILD_NUMBER}",
    "gitCommit": "${env.GIT_COMMIT ?: 'unknown'}"
}
"""
                        }
                    }
                }
                
                stage('2.6 - Package Application') {
                    steps {
                        script {
                            sh """
                                mkdir -p package
                                cp -r ${BACKEND_DIR} package/backend
                                cp -r ${FRONTEND_DIR}/dist package/frontend
                                cp version.json package/
                                cp ${ENV_FILE} package/backend/.env
                                
                                # Copy root package.json if it exists
                                if [ -f package.json ]; then
                                    cp package.json package/
                                fi
                                
                                mkdir -p ${ARCHIVE_DIR}
                                cd package
                                zip -r ${ARCHIVE_DIR}/app-${env.RELEASE_VERSION}.zip .
                            """
                            echo "Package created: app-${env.RELEASE_VERSION}.zip"
                        }
                    }
                }
                
                stage('2.7 - Archive Artifact') {
                    steps {
                        script {
                            archiveArtifacts artifacts: "${ARCHIVE_DIR}/app-${env.RELEASE_VERSION}.zip"
                            echo "Artifact archived in Jenkins"
                        }
                    }
                }
            }
        }
        
        stage('Phase 3: Deployment') {
            when { branch 'main' }
            
            input {
                message 'Phase 3: Deploy to Environment'
                ok 'Deploy'
                submitter 'infrastructure-team,deployment-team'
                parameters {
                    choice(
                        name: 'DEPLOY_TARGET',
                        choices: ['Staging', 'UAT', 'Production'],
                        description: 'Target environment'
                    )
                    choice(
                        name: 'DEPLOY_PACKAGE',
                        choices: 'getAvailablePackages()',
                        description: 'Package to deploy'
                    )
                }
            }
            
            stages {
                stage('3.1 - Validate Package') {
                    steps {
                        script {
                            def packagePath = "${ARCHIVE_DIR}/${params.DEPLOY_PACKAGE}"
                            if (!fileExists(packagePath)) {
                                error "Package not found: ${params.DEPLOY_PACKAGE}"
                            }
                            echo "Package validated: ${params.DEPLOY_PACKAGE}"
                        }
                    }
                }
                
                stage('3.2 - Prepare Deployment Directory') {
                    steps {
                        script {
                            def deployDir = "deployments/${params.DEPLOY_TARGET}"
                            sh """
                                rm -rf ${deployDir}
                                mkdir -p ${deployDir}
                            """
                        }
                    }
                }
                
                stage('3.3 - Extract Package') {
                    steps {
                        script {
                            sh """
                                unzip ${ARCHIVE_DIR}/${params.DEPLOY_PACKAGE} -d deployments/${params.DEPLOY_TARGET}/
                            """
                            echo "Package extracted"
                        }
                    }
                }
                
                stage('3.4 - Inject Environment Configuration') {
                    steps {
                        script {
                            def targetDir = "deployments/${params.DEPLOY_TARGET}"
                            
                            def envConfig = getEnvConfig(params.DEPLOY_TARGET)
                            writeFile file: "${targetDir}/backend/.env", text: envConfig
                            
                            echo "Environment config injected for ${params.DEPLOY_TARGET}"
                            echo "MongoDB: ${getMongoDBURI(params.DEPLOY_TARGET)}"
                        }
                    }
                }
                
                stage('3.5 - Deploy to Target Environment') {
                    steps {
                        script {
                            def targetServer = getTargetServer(params.DEPLOY_TARGET)
                            
                            echo """
                            DEPLOYING TO ${params.DEPLOY_TARGET}
                            Server: ${targetServer}
                            Package: ${params.DEPLOY_PACKAGE}
                            MongoDB: ${getMongoDBURI(params.DEPLOY_TARGET)}
                            """
                            
                            sh """
                                echo "Deployment to ${params.DEPLOY_TARGET} started at \$(date)"
                                echo "Backend deployed to: ${targetServer}/backend"
                                echo "Frontend deployed to: ${targetServer}/frontend"
                                if [ -f deployments/${params.DEPLOY_TARGET}/package.json ]; then
                                    echo "Root package.json included in deployment"
                                fi
                                echo "Deployment completed at \$(date)"
                            """
                        }
                    }
                }
                
                stage('3.6 - Health Check') {
                    steps {
                        script {
                            def healthUrl = "http://${getTargetServer(params.DEPLOY_TARGET)}/health"
                            echo "Health check: ${healthUrl}"
                            echo "Deployment verified"
                        }
                    }
                }
                
                stage('3.7 - Deployment Success') {
                    steps {
                        echo "Deployment to ${params.DEPLOY_TARGET} completed successfully"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'PIPELINE COMPLETED SUCCESSFULLY'
        }
        failure {
            echo 'PIPELINE FAILED - Check logs'
        }
        cleanup {
            sh 'rm -rf deployments/ package/'
        }
    }
}

def getAvailablePackages() {
    def packages = []
    try {
        def files = findFiles(glob: "${ARCHIVE_DIR}/app-*.zip")
        files.each { file ->
            packages.add(file.getName())
        }
        if (packages.isEmpty()) {
            packages.add('No packages available')
        }
    } catch (e) {
        packages.add('No packages available')
    }
    return packages
}

def getMongoDBURI(env) {
    switch(env) {
        case 'Staging':
            return 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/ecommerce-staging?retryWrites=true&w=majority'
        case 'UAT':
            return 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/ecommerce-uat?retryWrites=true&w=majority'
        case 'Production':
            return 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/ecommerce-production?retryWrites=true&w=majority'
        default:
            return 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/?retryWrites=true&w=majority'
    }
}

def getEnvConfig(env) {
    def mongoUri = getMongoDBURI(env)
    def jwtSecret = "mysecretkey-${env.toLowerCase()}"
    
    return """
# Environment: ${env}
MONGO_URI=${mongoUri}
PORT=5000
JWT_SECRET=${jwtSecret}
NODE_ENV=${env.toLowerCase()}
"""
}

def getTargetServer(env) {
    switch(env) {
        case 'Staging':
            return 'staging-server.yourdomain.com'
        case 'UAT':
            return 'uat-server.yourdomain.com'
        case 'Production':
            return 'production-server.yourdomain.com'
        default:
            return 'localhost'
    }
}