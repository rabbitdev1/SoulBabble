package com.rizalsujana.soulbabble.data

import com.rizalsujana.soulbabble.R
import org.json.JSONArray

object OnBoardingData {
    val items = listOf(
        OnBoardingItems(
            R.drawable.ic_launcher_background,
            "Mulai Perjalanan Anda dengan Soul Babble",
            "Langkah pertama menuju pemahaman diri yang lebih baik dimulai di sini. Soul Babble membantu Anda mengidentifikasi dan mengelola emosi Anda setiap hari dengan mudah. Catat perasaan Anda, dan biarkan kami membantu Anda memahami pola emosional Anda."
        ),
        OnBoardingItems(
            R.drawable.ic_launcher_background,
            "Analisis Mood yang Mendalam",
            "Dapatkan wawasan yang lebih dalam tentang suasana hati Anda. Soul Babble menganalisis perubahan mood Anda dari waktu ke waktu, memberikan gambaran tentang kesehatan mental Anda dan membantu Anda mengenali pemicu stres atau kecemasan."
        ),
        OnBoardingItems(
            R.drawable.ic_launcher_background,
            "Tips Personalisasi untuk Kesejahteraan Mental",
            "Setiap orang unik, dan begitu pula perjalanan kesehatan mental mereka. Dapatkan saran dan kegiatan yang disesuaikan berdasarkan analisis mood Anda untuk meningkatkan kesehatan mental dan kesejahteraan emosional."
        ),
        OnBoardingItems(
            R.drawable.ic_launcher_background,
            "Dukungan Kapan Pun Anda Membutuhkannya",
            "Soul Babble ada untuk Anda 24/7. Apakah Anda membutuhkan pengingat untuk meditasi, saran relaksasi, atau sekadar tempat untuk mencurahkan pikiran, aplikasi kami siap membantu Anda di setiap langkah."
        )
    )
}

val dataDummyNotification = JSONArray(
    """
    [
        {
            "title": "Notifikasi 1",
            "description": "Deskripsi Notifikasi 1",
            "date": "2023-12-06"
        },
        {
            "title": "Notifikasi 2",
            "description": "Deskripsi Notifikasi 2",
            "date": "2023-12-07"
        },
        {
            "title": "Notifikasi 3",
            "description": "Deskripsi Notifikasi 3",
            "date": "2023-12-08"
        }
    ]
    """
)