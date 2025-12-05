require('dotenv').config();
const AWS = require("aws-sdk");
const path = require('path');

// Load configuration from environment variables with defaults
const config = {
    region: process.env.AWS_REGION || "ap-south-1",
    bucket: process.env.S3_BUCKET || "gitbucket4516",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

// Validate required environment variables
if (!config.accessKeyId || !config.secretAccessKey) {
    console.warn('⚠️ AWS credentials not found in environment variables');
    console.warn('   Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file');
}

// Configure AWS SDK
const awsConfig = {
    region: config.region,
    apiVersion: '2006-03-01',
    maxRetries: 3,
    httpOptions: {
        connectTimeout: 5000,
        timeout: 10000
    }
};

// Only add credentials if they are provided
if (config.accessKeyId && config.secretAccessKey) {
    awsConfig.accessKeyId = config.accessKeyId;
    awsConfig.secretAccessKey = config.secretAccessKey;
}

const s3 = new AWS.S3(awsConfig);

// Test the connection
async function testConnection() {
    try {
        await s3.headBucket({ Bucket: config.bucket }).promise();
        console.log('✅ Successfully connected to S3 bucket:', config.bucket);
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to S3 bucket:', error.message);
        if (error.statusCode === 403) {
            console.error('  - Check if your AWS credentials have the correct permissions');
            console.error('  - Verify the bucket name is correct');
            console.error('  - Check if the bucket is in the correct region');
        } else if (error.statusCode === 404) {
            console.error('  - The specified bucket does not exist');
        }
        return false;
    }
}

module.exports = {
    s3,
    S3_BUCKET: config.bucket,
    testConnection
};
