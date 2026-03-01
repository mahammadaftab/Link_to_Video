const QueueService = require('../services/queueService');

// Get conversion status
const getStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const status = await QueueService.getJobStatus(id);
    
    res.status(200).json({
      id,
      status: status.status,
      progress: status.progress,
      data: status.data
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get job status' });
  }
};

module.exports = {
  getStatus
};