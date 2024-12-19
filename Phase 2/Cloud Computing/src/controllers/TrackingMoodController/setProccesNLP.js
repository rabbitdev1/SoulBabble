import { spawn } from 'child_process';

export const setProcessNLP = async (req, res) => {
  const apiKey = req.headers['api-key'];
  const { level_emosi, tipe_emosi, sumber_emosi, } = req.body;
  const { predicted_questions_1, predicted_questions_2, predicted_questions_3, predicted_questions_4, predicted_questions_5 } = req.body;
  const { user_provided_questions_1, user_provided_questions_2, user_provided_questions_3, user_provided_questions_4, user_provided_questions_5 } = req.body;

  // Validasi data yang masuk
  if (!apiKey || !level_emosi || !tipe_emosi || !sumber_emosi || !predicted_questions_1 || !predicted_questions_2 || !predicted_questions_3 || !predicted_questions_4 || !predicted_questions_5 || !user_provided_questions_1 || !user_provided_questions_2 || !user_provided_questions_3 || !user_provided_questions_4 || !user_provided_questions_5) {
    return res.status(400).json({
      status: 400,
      msg: 'All fields are required',
    });
  }
  const data_emosi = {
    level_emosi,
    tipe_emosi,
    sumber_emosi,
    predicted_questions: [
      predicted_questions_1,
      predicted_questions_2,
      predicted_questions_3,
      predicted_questions_4,
      predicted_questions_5
    ],
    user_provided_questions: [
      user_provided_questions_1,
      user_provided_questions_2,
      user_provided_questions_3,
      user_provided_questions_4,
      user_provided_questions_5
    ],
  };

  console.log('Data yang dikirim ke Python:', data_emosi);
  try {
    // Memulai proses Python
    const pythonProcess = spawn('python', ['app/predictNLP.py', JSON.stringify(data_emosi)]);

    let result = '';
    let error = '';

    // Menangkap output dari stdout Python
    pythonProcess.stdout.on('data', (data) => {
      const jsonRegex = /{[^]*}/;
      const matches = data.toString().match(jsonRegex);

      if (matches && matches[0]) {
        result += matches[0]; // Simpan hanya JSON valid
      } else {
        console.log('Non-JSON log:', data.toString()); // Log lainnya untuk debugging
      }
    });

    // Menangkap error dari stderr Python
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('Python stderr:', data.toString());
    });

    // Ketika proses Python selesai
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
        const cleanedResult = matches[0];

        try {
          // Parsing hasil JSON
          const parsedResult = JSON.parse(cleanedResult);
          console.log('Parsed result:', parsedResult);

          // Mengirimkan hasil JSON kembali ke client
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
