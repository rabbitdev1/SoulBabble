package id.soulbabble.bangkit.data

import id.soulbabble.bangkit.R
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
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 1. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-06"
        },
        {
            "title": "Notifikasi 2",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 2. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-07"
        },
        {
            "title": "Notifikasi 3",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 3. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-08"
        },
        {
            "title": "Notifikasi 4",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 4. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-09"
        },
        {
            "title": "Notifikasi 5",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 5. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-10"
        },
        {
            "title": "Notifikasi 4",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 4. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-09"
        },
        {
            "title": "Notifikasi 5",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 5. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-10"
        },
        {
            "title": "Notifikasi 4",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 4. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-09"
        },
        {
            "title": "Notifikasi 5",
            "description": "Ini adalah deskripsi yang lebih panjang untuk Notifikasi 5. Deskripsi ini berisi lebih banyak teks dan informasi tentang notifikasi ini. Notifikasi ini akan memberikan lebih banyak detail kepada pengguna.",
            "date": "2023-12-10"
        }
    ]
    """
)

val dataDummyIntersting = JSONArray(
    """
    [
        {
            "title": "Tes Kepribadian Gratis",
            "image":"https://images.ctfassets.net/cnu0m8re1exe/3Rom6Wl30JAyXQfPBR2kgx/357c8172c06a2f45b1e5222c1b69d764/shutterstock_2070009056.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill",
            "description": "Jadilah diri sendiri dan jawablah dengan jujur ​​untuk mengetahui tipe kepribadian Anda.",
            "url" : "https://www.16personalities.com/free-personality-test",
            "date": "2023-12-06"
        },
        {
            "title": "Tes Kepribadian Gratis",
            "image":"https://images.ctfassets.net/cnu0m8re1exe/3Rom6Wl30JAyXQfPBR2kgx/357c8172c06a2f45b1e5222c1b69d764/shutterstock_2070009056.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill",
            "description": "Jadilah diri sendiri dan jawablah dengan jujur ​​untuk mengetahui tipe kepribadian Anda.",
            "url" : "https://www.16personalities.com/free-personality-test",
            "date": "2023-12-06"
        },
        {
            "title": "Tes Kepribadian Gratis",
            "image":"https://images.ctfassets.net/cnu0m8re1exe/3Rom6Wl30JAyXQfPBR2kgx/357c8172c06a2f45b1e5222c1b69d764/shutterstock_2070009056.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill",
            "description": "Jadilah diri sendiri dan jawablah dengan jujur ​​untuk mengetahui tipe kepribadian Anda.",
            "url" : "https://www.16personalities.com/free-personality-test",
            "date": "2023-12-06"
        },
        {
            "title": "Tes Kepribadian Gratis",
            "image":"https://images.ctfassets.net/cnu0m8re1exe/3Rom6Wl30JAyXQfPBR2kgx/357c8172c06a2f45b1e5222c1b69d764/shutterstock_2070009056.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill",
            "description": "Jadilah diri sendiri dan jawablah dengan jujur ​​untuk mengetahui tipe kepribadian Anda.",
            "url" : "https://www.16personalities.com/free-personality-test",
            "date": "2023-12-06"
        },
        {
            "title": "Tes Kepribadian Gratis",
            "image":"https://images.ctfassets.net/cnu0m8re1exe/3Rom6Wl30JAyXQfPBR2kgx/357c8172c06a2f45b1e5222c1b69d764/shutterstock_2070009056.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill",
            "description": "Jadilah diri sendiri dan jawablah dengan jujur ​​untuk mengetahui tipe kepribadian Anda.",
            "url" : "https://www.16personalities.com/free-personality-test",
            "date": "2023-12-06"
        }
    ]
    """
)

val dataDummyWeeklyMood = JSONArray(
    """
        [
            {
        "days": "Senin",
            "date":"03-12-2023",
            "emoticon":"❌",
            "cheking":false
            },
            {
        "days": "Selasa",
            "date":"04-12-2023",
            "emoticon":"❌",
            "cheking":false
            },
            {
        "days": "Rabu",
            "date":"05-12-2023",
            "emoticon":"❌",
            "cheking":false
            },
            {
        "days": "Kamis",
            "date":"06-12-2023",
            "emoticon":"❌",
            "cheking":true
            },
            {
        "days": "Jumat",
            "date":"07-12-2023",
            "emoticon":"❌",
            "cheking":true
            },
            {
        "days": "Sabtu",
            "date":"08-12-2023",
            "emoticon":"❌",
            "cheking":true
            },
            {
        "days": "Minggu",
            "date":"09-12-2023",
            "emoticon":"❌",
            "cheking":true
            }
        ]
    """

)

val dataDummyEmoticon = JSONArray(
    """
        [
            {
        "id": "very_bad",
            "name":"Sangat Buruk",
            "emoticon":"😔",
            "total":"10"
            },
            {
        "id": "bad",
            "name":"Buruk",
            "emoticon":"🥲️",
            "total":"10"
            },
            {
        "id": "neutral",
            "name":"Biasa",
            "emoticon":"🙂",
            "total":"10"
            },
            {
        "id": "good",
            "name":"Baik",
            "emoticon":"😊",
            "total":"10"
            },
            {
        "id": "very_good",
            "name":"Sangat Baik",
            "emoticon":"😁",
            "total":"10"
            }
        ]
    """
)

val dataDummyTrackEmotionPositive = JSONArray(
    """
        [
          {"type":"positive", "name":"kegembiraan"},
          {"type":"positive", "name":"kesyukuran"},
          {"type":"positive", "name":"ketenangan"},
          {"type":"positive", "name":"ketertarikan"},
          {"type":"positive", "name":"harapan"},
          {"type":"positive", "name":"kebanggaan"},
          {"type":"positive", "name":"kehiliruan"},
          {"type":"positive", "name":"inspirasi"},
          {"type":"positive", "name":"kagum"},
          {"type":"positive", "name":"cinta"},
          {"type":"positive", "name":"kepuasan"},
          {"type":"positive", "name":"lega"},
          {"type":"positive", "name":"kegairahan"},
          {"type":"positive", "name":"kebahagiaan"},
          {"type":"positive", "name":"antusiasme"},
          {"type":"positive", "name":"kegigihan"},
          {"type":"positive", "name":"optimisme"},
          {"type":"positive", "name":"keceriaan"},
          {"type":"positive", "name":"keberuntungan"},
          {"type":"positive", "name":"kesenangan"},
          {"type":"positive", "name":"keberanian"},
          {"type":"positive", "name":"ketabahan"},
          {"type":"positive", "name":"kehangatan"},
          {"type":"positive", "name":"kelembutan"}
        ]
    """
)

val dataDummyTrackEmotionNegative = JSONArray(
    """
        [
          {"type":"negative", "name":"kemarahan"},
          {"type":"negative", "name":"ketakutan"},
          {"type":"negative", "name":"kesedihan"},
          {"type":"negative", "name":"kejijikan"},
          {"type":"negative", "name":"iri hati"},
          {"type":"negative", "name":"cemburu"},
          {"type":"negative", "name":"frustrasi"},
          {"type":"negative", "name":"kekecewaan"},
          {"type":"negative", "name":"penyesalan"},
          {"type":"negative", "name":"rasa bersalah"},
          {"type":"negative", "name":"malu"},
          {"type":"negative", "name":"kecemasan"},
          {"type":"negative", "name":"kesepian"},
          {"type":"negative", "name":"keputusasaan"},
          {"type":"negative", "name":"ketiadaan harapan"},
          {"type":"negative", "name":"kelebihan beban"},
          {"type":"negative", "name":"stres"},
          {"type":"negative", "name":"kebosanan"},
          {"type":"negative", "name":"kekhawatiran"},
          {"type":"negative", "name":"ketidakamanan"},
          {"type":"negative", "name":"kepanikan"},
          {"type":"negative", "name":"kebingungan"},
          {"type":"negative", "name":"ketidakpuasan"},
          {"type":"negative", "name":"ketidaknyamanan"}
        ]
    """
)

val dataDummyTrackSourceEmotion = JSONArray(
    """
        [
    {"type":"internal", "name":"diri sendiri"},
    {"type":"external", "name":"keluarga"},
    {"type":"external", "name":"lingkungan kerja"},
    {"type":"external", "name":"teman-teman"},
    {"type":"external", "name":"peristiwa sehari-hari"},
    {"type":"external", "name":"media sosial"},
    {"type":"external", "name":"berita"},
    {"type":"external", "name":"pengalaman masa lalu"},
    {"type":"external", "name":"lingkungan fisik"},
    {"type":"external", "name":"acara atau kejadian tertentu"},
    {"type":"internal", "name":"kecemasan"},
    {"type":"internal", "name":"kebahagiaan"},
    {"type":"internal", "name":"kekecewaan"},
    {"type":"external", "name":"pertemanan"},
    {"type":"external", "name":"perasaan cinta"},
    {"type":"external", "name":"keberhasilan"},
    {"type":"external", "name":"kegagalan"},
    {"type":"external", "name":"ketidakpastian"},
    {"type":"external", "name":"kesehatan fisik"},
    {"type":"external", "name":"perubahan cuaca"},
    {"type":"external", "name":"pemberian"},
    {"type":"external", "name":"keadilan"},
    {"type":"internal", "name":"rindu"},
    {"type":"internal", "name":"kesepian"},
    {"type":"external", "name":"kebijakan pemerintah"},
    {"type":"external", "name":"lingkungan alam"},
    {"type":"external", "name":"teknologi baru"},
    {"type":"internal", "name":"stres"},
    {"type":"internal", "name":"ketidakpastian masa depan"}
]
        """
)
val dataDummyJournaling = JSONArray(
    """
        [
    {"userid":"dsfgsgsdfs","date":"12-12-2022","post":"Lorem ipsum basfasfsgsdgdfg sdghsdfhsdf sdfhsdbfhjbsdsd sdhfgsjfh"},
    {"userid":"dsfgsgsdfs","date":"12-12-2022","post":"Lorem ipsum basfasfsgsdgdfg sdghsdfhsdf sdfhsdbfhjbsdsd sdhfgsjfh"},
    {"userid":"dsfgsgsdfs","date":"12-12-2022","post":"Lorem ipsum basfasfsgsdgdfg sdghsdfhsdf sdfhsdbfhjbsdsd sdhfgsjfh"},
    {"userid":"dsfgsgsdfs","date":"12-12-2022","post":"Lorem ipsum basfasfsgsdgdfg sdghsdfhsdf sdfhsdbfhjbsdsd sdhfgsjfh"},
    {"userid":"dsfgsgsdfs","date":"12-12-2022","post":"Lorem ipsum basfasfsgsdgdfg sdghsdfhsdf sdfhsdbfhjbsdsd sdhfgsjfh"},
    {"userid":"dsfgsgsdfs","date":"12-12-2022","post":"Lorem ipsum basfasfsgsdgdfg sdghsdfhsdf sdfhsdbfhjbsdsd sdhfgsjfh"}
  
]
        """
)


val dummyMessages: List<Pair<String, Boolean>> = listOf(
    "Hi, thanks for accompanying me today. really enjoyed today i like it" to true,
    "Oh it's okay i like it too babe" to false,
    "Next time, we will meet again?" to true,
    "Soon we go to a restaurant that is very viral yups ;)" to true,
    "Oke babe :)" to false
)

//
//val dataDummyProfile = JSONArray(
//    """
//        {
//          "error": false,
//          "message": "success",
//          "loginResult": {
//            "userId": "user-yj5pc_LARC_AgK61",
//            "name": "Arif Faizin",
//            "listmood": [
//              {
//                "date": "2023-12-07",
//                "type": "very_bad",
//                "positive": [
//                  "kegigihan",
//                  "manja",
//                  "ketersediaan"
//                ],
//                "negative": [
//                  "kemarahan",
//                  "iri hati"
//                ],
//                "sourceEmotion": [
//                  "pekerjaan",
//                  "diri sendiri"
//                ]
//              }
//            ]
//          }
//        }
//    """
//)