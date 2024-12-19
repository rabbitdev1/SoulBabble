import { spawn } from 'child_process';

export const getRecommendations = async (req, res) => {
  const {  emotion_dominant } = req.body;
  const apiKey = req.headers["api-key"];

  if (!apiKey || !emotion_dominant) {
    return res.status(400).json({
      status: 400,
      msg: 'Items are required fields',
    });
  }

  try {
    // Jalankan Python script sebagai subprocess
    const pythonProcess = spawn('python', ['app/predictNCF.py', apiKey, ...emotion_dominant]);

    let result = '';
    let error = '';

    // Tangkap output dari script Python
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({
          status: 500,
          msg: 'Error running Python script',
          error,
        });
      }

      try {
        // Parsing hasil JSON dari Python
        const parsedResult = JSON.parse(result);
        return res.status(200).json(parsedResult);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError.message);
        return res.status(500).json({
          status: 500,
          msg: 'Error parsing Python result',
          error: parseError.message,
        });
      }
    });
  } catch (err) {
    console.error('Error running subprocess:', err.message);
    return res.status(500).json({
      status: 500,
      msg: 'Internal server error',
      error: err.message,
    });
  }
};
