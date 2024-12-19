import { spawn } from 'child_process';

export const setEmotionData = async (req, res) => {
  const apiKey = req.headers['api-key'];
  const { level_emotion, type_emotion, source_emotion } = req.body;

  if (!apiKey || !level_emotion || !type_emotion || !source_emotion) {
    return res.status(400).json({
      status: 400,
      msg: 'All fields are required',
    });
  }

  try {
    // Jalankan script Python sebagai subprocess
    const pythonProcess = spawn('python', ['app/predictEmotion.py', level_emotion, type_emotion, source_emotion]);

    let result = '';
    let error = '';

    // Terima output dari script Python
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
          error: error,
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
  } catch (error) {
    console.error('Error connecting to Python script:', error.message);
    return res.status(500).json({
      status: 500,
      msg: 'Internal Server Error. Please try again later.',
    });
  }
};
