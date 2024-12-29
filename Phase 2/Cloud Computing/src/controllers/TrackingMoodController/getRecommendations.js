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
      const jsonRegex = /{[^]*}/; 
      const matches = result.match(jsonRegex);

      if (matches && matches[0]) {
        const cleanedResult = matches[0];  // Ambil hasil pertama dari regex

        try {
          // Parsing hasil JSON
          const parsedResult = JSON.parse(cleanedResult);
          console.log('Parsed result:', parsedResult);

          return res.status(200).json(parsedResult);
        } catch (parseError) {
          console.error('Error parsing Python result:', parseError.message);
          return res.status(500).json({
            status: 500,
            msg: 'Error parsing Python result',
            error: parseError.message,
          });
        }
      } else {
        console.error('No valid JSON found in Python output.');
        return res.status(500).json({
          status: 500,
          msg: 'Error: No valid JSON in output',
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
