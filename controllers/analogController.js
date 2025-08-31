import AnalogData from "../models/analogModel.js";
import { Parser } from 'json2csv';

// Variable to track the auto-generation interval
let autoGenerationInterval = null;

// Function to generate random data
const generateRandomData = () => {
  return {
    voltage: parseFloat((Math.random() * (250 - 200) + 200).toFixed(2)),
    current: parseFloat((Math.random() * (20 - 5) + 5).toFixed(2)),
    frequency: parseFloat((Math.random() * (60 - 50) + 50).toFixed(2)),
    phaseDifference: parseFloat((Math.random() * (30 - 0) + 0).toFixed(2)),
    timestamp: new Date()
  };
};

// Start automatic data generation when the server starts
const startAutoGeneration = (interval = 1000) => {
  if (autoGenerationInterval) {
    clearInterval(autoGenerationInterval);
  }
  
  autoGenerationInterval = setInterval(async () => {
    try {
      const randomData = generateRandomData();
      const analogData = new AnalogData(randomData);
      await analogData.save();
      console.log('Auto-generated data:', randomData);
    } catch (error) {
      console.error('Error auto-generating data:', error.message);
    }
  }, interval);
};

// Start generating data automatically when the controller loads
startAutoGeneration(2000); // Generate data every second

const analogController = {
  // Get all analog data
  getAllData: async (req, res) => {
    try {
      const data = await AnalogData.find().sort({ timestamp: -1 });
      
      res.status(200).json({
        success: true,
        count: data.length,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving analog data',
        error: error.message
      });
    }
  },
  
  // Get only voltage data
  getVoltageData: async (req, res) => {
    try {
      const data = await AnalogData.find({}, { voltage: 1, timestamp: 1, _id: 0 })
        .sort({ timestamp: -1 });
      
      res.status(200).json({
        success: true,
        count: data.length,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving voltage data',
        error: error.message
      });
    }
  },
  
  // Get only current data
  getCurrentData: async (req, res) => {
    try {
      const data = await AnalogData.find({}, { current: 1, timestamp: 1, _id: 0 })
        .sort({ timestamp: -1 });
      
      res.status(200).json({
        success: true,
        count: data.length,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving current data',
        error: error.message
      });
    }
  },
  
  // Get only frequency data
  getFrequencyData: async (req, res) => {
    try {
      const data = await AnalogData.find({}, { frequency: 1, timestamp: 1, _id: 0 })
        .sort({ timestamp: -1 });
      
      res.status(200).json({
        success: true,
        count: data.length,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving frequency data',
        error: error.message
      });
    }
  },
  
  // Get only phase difference data
  getPhaseDifferenceData: async (req, res) => {
    try {
      const data = await AnalogData.find({}, { phaseDifference: 1, timestamp: 1, _id: 0 })
        .sort({ timestamp: -1 });
      
      res.status(200).json({
        success: true,
        count: data.length,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving phase difference data',
        error: error.message
      });
    }
  },
  
  // Get data by ID
  getDataById: async (req, res) => {
    try {
      const data = await AnalogData.findById(req.params.id);
      
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Analog data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving analog data',
        error: error.message
      });
    }
  },
  
  // Delete all data (for cleanup)
  deleteAllData: async (req, res) => {
    try {
      const result = await AnalogData.deleteMany({});
      
      res.status(200).json({
        success: true,
        message: `Deleted ${result.deletedCount} analog data points`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting analog data',
        error: error.message
      });
    }
  },
  
  // Get data statistics
  getStats: async (req, res) => {
    try {
      const stats = await AnalogData.aggregate([
        {
          $group: {
            _id: null,
            voltageAvg: { $avg: "$voltage" },
            voltageMin: { $min: "$voltage" },
            voltageMax: { $max: "$voltage" },
            currentAvg: { $avg: "$current" },
            currentMin: { $min: "$current" },
            currentMax: { $max: "$current" },
            phaseAvg: { $avg: "$phaseDifference" },
            phaseMin: { $min: "$phaseDifference" },
            phaseMax: { $max: "$phaseDifference" },
            freqAvg: { $avg: "$frequency" },
            freqMin: { $min: "$frequency" },
            freqMax: { $max: "$frequency" },
            count: { $sum: 1 }
          }
        }
      ]);
      
      res.status(200).json({
        success: true,
        stats: stats[0] || {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving statistics',
        error: error.message
      });
    }
  },
  
  // Get latest data point
  getLatestData: async (req, res) => {
    try {
      const data = await AnalogData.findOne().sort({ timestamp: -1 });
      
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'No analog data found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving latest data',
        error: error.message
      });
    }
  },

  exportToCSV: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Build query based on date range
      let query = {};
      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      // Get data from database
      const data = await AnalogData.find(query).sort({ timestamp: 1 });
      
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No data found for the specified time range'
        });
      }
      
      // Prepare data for CSV
      const csvData = data.map(item => ({
        Timestamp: item.timestamp.toISOString(),
        Voltage: item.voltage,
        Current: item.current,
        Frequency: item.frequency,
        PhaseDifference: item.phaseDifference
      }));
      
      // Create CSV parser
      const parser = new Parser();
      const csv = parser.parse(csvData);
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analog-data-${Date.now()}.csv`);
      
      // Send CSV file
      res.status(200).send(csv);
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error exporting data to CSV',
        error: error.message
      });
    }
  },

  // ... (keep your other methods)
};

export default analogController;