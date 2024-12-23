package id.bangkit.soulbabble.ui

import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowInsetsController
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.AnswerAdapter
import id.bangkit.soulbabble.adapter.EmotionWeekAdapter
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.model.AnswerItem
import id.bangkit.soulbabble.model.EmotionWeekItem
import id.bangkit.soulbabble.utils.AuthStorage
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class CheckInFragment : Fragment(R.layout.fragment_check_in) {

    private val apiClient = ApiClient()
    private lateinit var recyclerViewEmotionWeek: RecyclerView
    private lateinit var recyclerViewAnswer: RecyclerView
    private lateinit var emotionWeekAdapter: EmotionWeekAdapter
    private lateinit var tvEmotionDetail: TextView
    private lateinit var tvEmotionDetailTime: TextView
    private lateinit var tvEmotionDetailTitle: TextView
    private lateinit var tvFactorialEmotion1: TextView
    private lateinit var tvFactorialEmotion2: TextView
    private lateinit var tvFactorialEmotion3: TextView

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        tvEmotionDetail = view.findViewById(R.id.tvEmotionDetail)
        tvEmotionDetailTime = view.findViewById(R.id.tvEmotionDetailTime)
        tvEmotionDetailTitle = view.findViewById(R.id.tvEmotionDetailTitle)
        tvFactorialEmotion1 = view.findViewById(R.id.tvFactorialEmotion1)
        tvFactorialEmotion2 = view.findViewById(R.id.tvFactorialEmotion2)
        tvFactorialEmotion3 = view.findViewById(R.id.tvFactorialEmotion3)

        setupStatusBar() // Mengatur tampilan status bar
        setupRecyclerViews(view) // Inisialisasi dan pengaturan RecyclerViews
        sendTrackingMoodData("17-12-2024", "30-12-2024") // Memanggil API


    }

    /**
     * Mengatur warna dan teks pada Status Bar agar sesuai dengan tema aplikasi.
     */
    @RequiresApi(Build.VERSION_CODES.R)
    private fun setupStatusBar() {
        activity?.window?.apply {
            statusBarColor = ContextCompat.getColor(requireContext(), R.color.primary)

            // Mengatur teks status bar menjadi terang
            insetsController?.setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS.inv(),
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
        }
    }

    /**
     * Menginisialisasi RecyclerViews untuk daftar emosi dan jawaban.
     */
    private fun setupRecyclerViews(view: View) {
        // Inisialisasi dan pengaturan RecyclerView untuk daftar EmotionWeek
        recyclerViewEmotionWeek = view.findViewById(R.id.recyclerViewEmotionWeek)
        recyclerViewEmotionWeek.layoutManager = GridLayoutManager(requireContext(), 7)
        emotionWeekAdapter = EmotionWeekAdapter(requireContext(), generateEmotionWeekList()) { emoji, emotionalFactors1,emotionalFactors2,emotionalFactors3,createAt, msgEmotion, resultQuestions, recommendations ->
            // Update TextViews with parsed data
            tvEmotionDetail.text =  emoji
            tvEmotionDetailTime.text = createAt
            tvEmotionDetailTitle.text = msgEmotion

            tvFactorialEmotion1.text = emotionalFactors1
            tvFactorialEmotion2.text = emotionalFactors2
            tvFactorialEmotion3.text = emotionalFactors3

            // Log or handle resultQuestions and recommendations if needed
            resultQuestions.forEach { (question, answer) ->
                println("Question: $question")
                println("Answer: $answer")
            }
            recommendations.forEach { (title, image, desc) ->
                println("Recommendation Title: $title")
                println("Image: $image")
                println("Description: $desc")
            }
        }
        recyclerViewEmotionWeek.adapter = emotionWeekAdapter

        // Inisialisasi dan pengaturan RecyclerView untuk daftar Answer
        recyclerViewAnswer = view.findViewById(R.id.recyclerViewEmotionAnswer)
        recyclerViewAnswer.layoutManager = LinearLayoutManager(requireContext())
        recyclerViewAnswer.adapter = AnswerAdapter(requireContext(), generateAnswerList())
    }

    /**
     * Membuat daftar dummy untuk Answer.
     */
    private fun generateAnswerList(): List<AnswerItem> = listOf(
        AnswerItem("Pertanyaan 1", "Jawaban 1"),
        AnswerItem("Pertanyaan 2", "Jawaban 2"),
        AnswerItem("Pertanyaan 3", "Jawaban 3"),
        AnswerItem("Pertanyaan 4", "Jawaban 4")
    )

    /**
     * Membuat daftar EmotionWeek berdasarkan data API response.
     */
    private fun generateEmotionWeekList(): List<EmotionWeekItem> {
        return listOf(
            EmotionWeekItem("❌", "Minggu","",""),
            EmotionWeekItem("❌", "Senin","",""),
            EmotionWeekItem("❌", "Selasa","",""),
            EmotionWeekItem("❌", "Rabu","",""),
            EmotionWeekItem("❌", "Kamis","",""),
            EmotionWeekItem("❌", "Jumat","",""),
            EmotionWeekItem("❌", "Sabtu","",""),
        )
    }

    /**
     * Mengambil data tracking mood dari API dan memperbarui daftar EmotionWeek.
     */
    private fun sendTrackingMoodData(startDate: String, endDate: String) {
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""

        apiClient.sendTrackingMoodData(startDate, endDate, apiKey, token) { response ->
            activity?.runOnUiThread {
                if (response != null) {
                    println(response)

                    // After receiving the response, update the EmotionWeek list with data
                    val updatedEmotionList = generateEmotionWeekListFromResponse(response)
                    emotionWeekAdapter.updateEmotionList(updatedEmotionList) // Update the adapter
                } else {
                    Toast.makeText(context, "Failed to get data", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }


    /**
     * Fungsi untuk menghasilkan daftar EmotionWeek berdasarkan data API response.
     */
    private fun generateEmotionWeekListFromResponse(apiResponse: String): List<EmotionWeekItem> {
        val jsonObject = JSONObject(apiResponse)
        val data = jsonObject.getJSONArray("data")

        val emotionList = mutableListOf<EmotionWeekItem>(
            EmotionWeekItem("❌", "Minggu","",""),
            EmotionWeekItem("❌", "Senin","",""),
            EmotionWeekItem("❌", "Selasa","",""),
            EmotionWeekItem("❌", "Rabu","",""),
            EmotionWeekItem("❌", "Kamis","",""),
            EmotionWeekItem("❌", "Jumat","",""),
            EmotionWeekItem("❌", "Sabtu","",""),
        )

        for (i in 0 until data.length()) {
            val item = data.getJSONObject(i)
            val resultedEmotion = item.getString("resultedEmotion") // Raw JSON string
            val createdAt = item.getString("createdAt")

            val resultedEmotion1 = JSONObject(item.getString("resultedEmotion"))
            val emotionName = resultedEmotion1.getString("emoji")


            // Extract the day of the week from the date (createdAt)
            val dayOfWeek = getDayOfWeekFromDate(createdAt)

            // Find the corresponding day in the emotionList and update the emoji
            emotionList.forEachIndexed { index, emotionWeekItem ->
                if (emotionWeekItem.dayOfWeek == dayOfWeek) {
                    emotionList[index] = EmotionWeekItem(emotionName, emotionWeekItem.dayOfWeek, resultedEmotion,createdAt)
                }
            }
        }

        return emotionList
    }

    /**
     * Helper function to get the day of the week from the date (createdAt).
     */
    private fun getDayOfWeekFromDate(dateString: String): String {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        val date = format.parse(dateString)
        val calendar = Calendar.getInstance()
        calendar.time = date

        return when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.SUNDAY -> "Minggu"
            Calendar.MONDAY -> "Senin"
            Calendar.TUESDAY -> "Selasa"
            Calendar.WEDNESDAY -> "Rabu"
            Calendar.THURSDAY -> "Kamis"
            Calendar.FRIDAY -> "Jumat"
            Calendar.SATURDAY -> "Sabtu"
            else -> "Unknown"
        }
    }
}
