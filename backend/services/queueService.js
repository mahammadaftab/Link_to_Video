const { Queue, Worker } = require('bullmq');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { startVideoConversion } = require('./extractionService');

// Redis connection options
const redisConnectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD })
};

// Create BullMQ queue for video conversions
const conversionQueue = new Queue('video conversion', {
  connection: redisConnectionOptions
});

// Create worker to process jobs
const conversionWorker = new Worker('video conversion', async (job) => {
  const { url, quality, format, jobId } = job.data;
  
  try {
    // Define output path
    const outputPath = path.join(__dirname, '../uploads/temp', `${jobId}.${format}`);
    
    // Perform the conversion
    const result = await startVideoConversion({ 
      url, 
      quality, 
      format, 
      outputPath 
    });
    
    return {
      success: true,
      outputPath: result.outputPath,
      jobId
    };
  } catch (error) {
    console.error(`Error processing conversion job ${job.id}:`, error);
    throw error;
  }
}, {
  connection: redisConnectionOptions,
  concurrency: 2 // Limit concurrent jobs to prevent overloading
});

// Process completion events
conversionWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

conversionWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

// Add a conversion job to the queue
const addConversionJob = async (jobData) => {
  const job = await conversionQueue.add(
    'convert',
    { ...jobData, createdAt: new Date().toISOString() },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      timeout: 300000 // 5 minutes
    }
  );
  
  return job;
};

// Get job status
const getJobStatus = async (jobId) => {
  const job = await conversionQueue.getJob(jobId);
  if (!job) {
    return { status: 'not_found' };
  }
  
  const state = await job.getState();
  const progress = job.progress;
  
  return {
    id: job.id,
    status: state,
    progress: progress,
    data: job.data
  };
};

module.exports = {
  addConversionJob,
  getJobStatus,
  queue: conversionQueue
};