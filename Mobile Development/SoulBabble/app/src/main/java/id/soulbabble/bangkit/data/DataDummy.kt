package id.soulbabble.bangkit.data

import id.soulbabble.bangkit.R
import org.json.JSONArray

object OnBoardingData {
    val items = listOf(
        OnBoardingItems(
            R.drawable.iconlogodark,
            "Mulai Perjalanan Anda dengan Soul Babble",
            "Langkah pertama menuju pemahaman diri yang lebih baik dimulai di sini. Soul Babble membantu Anda mengidentifikasi dan mengelola emosi Anda setiap hari dengan mudah. Catat perasaan Anda, dan biarkan kami membantu Anda memahami pola emosional Anda."
        ), OnBoardingItems(
            R.drawable.iconlogodark,
            "Analisis Mood yang Mendalam",
            "Dapatkan wawasan yang lebih dalam tentang suasana hati Anda. Soul Babble menganalisis perubahan mood Anda dari waktu ke waktu, memberikan gambaran tentang kesehatan mental Anda dan membantu Anda mengenali pemicu stres atau kecemasan."
        ), OnBoardingItems(
            R.drawable.iconlogodark,
            "Tips Personalisasi untuk Kesejahteraan Mental",
            "Setiap orang unik, dan begitu pula perjalanan kesehatan mental mereka. Dapatkan saran dan kegiatan yang disesuaikan berdasarkan analisis mood Anda untuk meningkatkan kesehatan mental dan kesejahteraan emosional."
        ), OnBoardingItems(
            R.drawable.iconlogodark,
            "Dukungan Kapan Pun Anda Membutuhkannya",
            "Soul Babble ada untuk Anda 24/7. Apakah Anda membutuhkan pengingat untuk meditasi, saran relaksasi, atau sekadar tempat untuk mencurahkan pikiran, aplikasi kami siap membantu Anda di setiap langkah."
        )
    )
}


val dataDummyNotification = """
   [
    {
        "title": "Tips Mengelola Stres Liburan Akhir Tahun",
        "description": "Hindari kumpul-kumpul berlebihan, buat jadwal istirahat, dan praktikkan self-care untuk menjaga kesehatan mental saat menghadapi kesibukan akhir tahun.",
        "date": "2023-12-20"
    },
    {
        "title": "Waspada Cyberbullying! Kenali Tanda-tandanya dan Cari Bantuan",
        "description": "Cyberbullying dapat menimbulkan efek negatif bagi kesehatan mental. Jika kamu menjadi korban, jangan diam saja, laporkan dan carilah dukungan dari orang sekitar dan profesional.",
        "date": "2023-12-21"
    },
    {
        "title": "Kelola Amarah dengan Teknik Relaksasi Pernapasan",
        "description": "Saat merasa marah, ambil napas dalam perlahan dan hembuskan pelan-pelan. Ulangi beberapa kali hingga merasa lebih tenang.",
        "date": "2023-12-22"
    },
    {
        "title": "Tidak Apa-apa Tidak Sempurna, Cintai Dirimu Apa Adanya",
        "description": "Setiap orang unik dan memiliki kekurangan. Beri afirmasi positif pada diri sendiri dan hargai setiap pencapaianmu.",
        "date": "2023-12-23"
    },
    {
        "title": "Mencari Bantuan untuk Mengatasi Kesedihan? Kamu Tidak Sendiri",
        "description": "Mengalami kesedihan adalah hal yang wajar. Jika merasa berat, jangan ragu untuk mencari bantuan dari psikolog atau terapis.",
        "date": "2023-12-24"
    },
    {
        "title": "Rayakan Kemenangan Kecilmu, Langkah Demi Langkah Menuju Kebahagiaan",
        "description": "Setiap pencapaian, sekecil apapun, patut dirayakan. Bersyukurlah atas kemajuanmu dan tetap semangat!",
        "date": "2023-12-25"
    },
    {
        "title": "Hadapi Ketakutanmu dengan Pikiran Positif dan Dukungan Orang Terdekat",
        "description": "Khawatir akan masa depan itu wajar. Hadapi dengan keyakinan dan cari dukungan dari orang-orang yang kamu sayangi.",
        "date": "2023-12-26"
    },
    {
        "title": "Menangislah, Tertawalah, Hidup Penuh Emosi dan Nikmati Setiap Momen",
        "description": "Tidak apa-apa untuk merasakan berbagai emosi. Ekspresikan dengan sehat dan nikmati indahnya hidup.",
        "date": "2023-12-27"
    },
    {
        "title": "Mulai Hari dengan Kebaikan, Senyapkan Negativitas dalam Pikiranmu",
        "description": "Fokuslah pada hal-hal positif dan lakukan kebaikan sederhana. Hal ini dapat meningkatkan mood dan kesehatan mentalmu.",
        "date": "2023-12-28"
    },
    {
        "title": "Hidup Adalah Perjalanan, Nikmati Prosesnya, Tak Perlu Terburu-buru",
        "description": "Jangan tertekan oleh pencapaian orang lain. Fokuslah pada perjalananmu sendiri dan rayakan setiap langkah kemajuanmu.",
        "date": "2023-12-29"
    },
    {
        "title": "Tips Meningkatkan Produktivitas dengan Menjaga Kesehatan Mental",
        "description": "Saat kesehatan mentalmu baik, kamu akan lebih mudah fokus dan produktif. Berikut adalah beberapa tips yang bisa kamu coba:

* Luangkan waktu untuk diri sendiri untuk beristirahat dan memulihkan energi.
* Tetapkan tujuan yang realistis dan terukur.
* Buatlah daftar tugas dan prioritaskan tugas-tugas yang penting.
* Hindari multitasking yang berlebihan.
* Luangkan waktu untuk melakukan aktivitas yang kamu sukai.

",
        "date": "2023-12-30"
    },
    {
        "title": "Bagaimana Mengatasi Stres Pascatrauma?",
        "description": "Stres pascatrauma (PTSD) adalah kondisi yang dapat terjadi setelah seseorang mengalami peristiwa traumatis, seperti kecelakaan, bencana alam, atau kekerasan. PTSD dapat menimbulkan berbagai gejala, seperti mimpi buruk, flashback, dan kecemasan.

Berikut adalah beberapa tips untuk mengatasi stres pascatrauma:

* Dapatkan dukungan dari orang-orang terdekat.
* Bicaralah dengan terapis atau psikolog.
* Ikuti terapi pemulihan pascatrauma.
* Lakukan aktivitas yang membantumu rileks, seperti yoga atau meditasi.

",
        "date": "2023-12-31"
    },
    {
        "title": "Kenali Tanda-tanda Depresi dan Cara Mengatasi",
        "description": "Depresi adalah gangguan kesehatan mental yang ditandai dengan perasaan sedih, putus asa, dan kehilangan minat dalam aktivitas yang biasanya dinikmati. Depresi dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tanda-tanda depresi:

* Rasa sedih atau putus asa yang berkepanjangan
* Hilangnya minat dalam aktivitas yang biasanya dinikmati
* Perubahan nafsu makan
* Perubahan pola tidur
* Kesulitan berkonsentrasi
* Perasaan bersalah atau tidak berharga
* Pikiran untuk menyakiti diri sendiri atau orang lain

Jika kamu mengalami beberapa tanda-tanda di atas, segeralah cari bantuan profesional. Depresi adalah kondisi yang dapat diobati dan kamu tidak perlu melaluinya sendirian.

",
        "date": "2024-01-01"
    },
    {
        "title": "Cara Menjaga Kesehatan Mental di Masa Pandemi",
        "description": "Pandemi COVID-19 telah berdampak signifikan pada kesehatan mental masyarakat. Banyak orang yang mengalami stres, kecemasan, dan depresi. Berikut adalah beberapa tips untuk menjaga kesehatan mental di masa pandemi:

* Tetapkan rutinitas yang sehat, seperti tidur yang cukup, makan makanan bergizi, dan berolahraga secara teratur.
* Luangkan waktu untuk bersosialisasi dengan orang-orang terkasih.
* Hindari menonton atau membaca berita negatif secara berlebihan.
* Lakukan aktivitas yang membantumu rileks, seperti yoga atau meditasi.

",
        "date": "2024-01-02"
    },
    {
        "title": "Tips Mengelola Gangguan Kecemasan",
        "description": "Gangguan kecemasan adalah kondisi kesehatan mental yang ditandai dengan perasaan cemas atau khawatir yang berlebihan dan tidak wajar. Gangguan kecemasan dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tips untuk mengelola gangguan kecemasan:

* Ikuti terapi perilaku kognitif (CBT).
* Lakukan teknik relaksasi, seperti yoga atau meditasi.
* Hindari mengonsumsi kafein dan alkohol.
* Dapatkan dukungan dari orang-orang terdekat.

",
        "date": "2024-01-03"
    },
    {
        "title": "Cara Meningkatkan Rasa Percaya Diri",
        "description":
        "Rasa percaya diri adalah hal yang penting untuk menjalani hidup dengan bahagia dan sukses. Berikut adalah beberapa tips untuk meningkatkan rasa percaya diri:

* Fokuslah pada hal-hal positif tentang diri sendiri.
* Tetapkan tujuan yang realistis dan terukur.
* Luangkan waktu untuk melakukan aktivitas yang kamu sukai.
* Dapatkan dukungan dari orang-orang terdekat.

",
        "date": "2024-01-04"
    },
     {
        "title": "Tips Mengelola Stres Pasca Persalinan",
        "description": "Stres pasca persalinan (PPD) adalah kondisi yang dapat dialami oleh wanita setelah melahirkan. PPD ditandai dengan perasaan sedih, cemas, dan tertekan. PPD dapat memengaruhi kemampuan wanita untuk merawat diri dan bayinya.

Berikut adalah beberapa tips untuk mengelola stres pasca persalinan:

* Dapatkan dukungan dari orang-orang terdekat.
* Bicaralah dengan terapis atau psikolog.
* Ikuti terapi pemulihan pascatrauma.
* Lakukan aktivitas yang membantumu rileks, seperti yoga atau meditasi.

",
        "date": "2024-01-05"
    },
    {
        "title": "Cara Menangani Kekerasan Dalam Rumah Tangga",
        "description": "Kekerasan dalam rumah tangga (KDRT) adalah kejahatan yang dapat berdampak serius pada kesehatan mental korban. Jika kamu atau orang yang kamu kenal mengalami KDRT, segeralah cari bantuan.

Berikut adalah beberapa sumber daya yang dapat membantu:

* Hotline kekerasan dalam rumah tangga
* Layanan konseling online
* Grup dukungan
* Lembaga bantuan hukum

",
        "date": "2024-01-06"
    },
    {
        "title": "Tips Menjaga Kesehatan Mental Remaja",
        "description": "Remaja berada pada masa transisi yang penting, sehingga mereka rentan mengalami masalah kesehatan mental. Berikut adalah beberapa tips untuk menjaga kesehatan mental remaja:

* Ajarkan remaja untuk mengenali dan mengelola emosi mereka.
* Berikan dukungan dan penerimaan tanpa syarat.
* Ajarkan remaja untuk membangun hubungan yang sehat.
* Berikan remaja kesempatan untuk melakukan aktivitas yang mereka sukai.

",
        "date": "2024-01-07"
    },
    {
        "title": "Cara Mengelola Stres di Tempat Kerja",
        "description": "Stres di tempat kerja dapat berdampak negatif pada kesehatan mental dan fisik. Berikut adalah beberapa tips untuk mengelola stres di tempat kerja:

* Tetapkan batas yang jelas antara kehidupan kerja dan kehidupan pribadi.
* Luangkan waktu untuk beristirahat dan memulihkan energi.
* Lakukan aktivitas yang membantumu rileks, seperti yoga atau meditasi.
* Bicaralah dengan rekan kerja atau atasan yang kamu percayai.

",
        "date": "2024-01-08"
    },
    {
        "title": "Tips Mengelola Rasa Marah",
        "description":
        "Rasa marah adalah emosi yang normal, tetapi jika tidak dikelola dengan baik, dapat menimbulkan masalah. Berikut adalah beberapa tips untuk mengelola rasa marah:

* Kenali pemicu kemarahanmu.
* Luangkan waktu untuk menenangkan diri sebelum bertindak.
* Lakukan teknik relaksasi, seperti yoga atau meditasi.
* Bicaralah dengan orang yang kamu percayai.

",
        "date": "2024-01-09"
    },
    {
        "title": "Cara Meningkatkan Kesadaran Diri",
        "description":
        "Kesadaran diri adalah kemampuan untuk memahami diri sendiri, termasuk emosi, pikiran, dan perilaku kita. Kesadaran diri yang baik dapat membantu kita mengelola stres, membuat keputusan yang lebih baik, dan menjalani hidup dengan lebih bermakna.

Berikut adalah beberapa tips untuk meningkatkan kesadaran diri:

* Luangkan waktu untuk merenungkan diri sendiri.
* Perhatikan emosi dan pikiranmu.
* Perhatikan perilakumu.
* Mintalah umpan balik dari orang lain.

",
        "date": "2024-01-10"
    },
    {
        "title": "Cara Membangun Resiliensi",
        "description":
        "Resiliensi adalah kemampuan untuk mengatasi kesulitan dan tantangan. Resiliensi yang baik dapat membantu kita menghadapi stres dan masalah dengan lebih baik.

Berikut adalah beberapa tips untuk membangun resilienci:

* Fokuslah pada hal-hal positif dalam hidupmu.
* Belajarlah dari pengalamanmu.
* Dapatkan dukungan dari orang-orang terdekat.
* Tetapkan tujuan yang realistis.

",
        "date": "2024-01-11"
    },
    {
        "title": "Tips Mengelola Gangguan Bipolar",
        "description":
        "Gangguan bipolar adalah kondisi kesehatan mental yang ditandai dengan perubahan suasana hati yang ekstrem, dari mania ke depresi. Gangguan bipolar dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tips untuk mengelola gangguan bipolar:

* Dapatkan pengobatan yang tepat dari dokter atau psikiater.
* Ikuti terapi perilaku kognitif (CBT).
* Lakukan teknik relaksasi, seperti yoga atau meditasi.
* Dapatkan dukungan dari orang-orang terdekat.

",
        "date": "2024-01-12"
    },
    {
        "title": "Cara Menangani Gangguan Obsessive Compulsive Disorder (OCD)",
        "description":
        "Gangguan obsesif kompulsif (OCD) adalah kondisi kesehatan mental yang ditandai dengan pikiran dan perilaku yang berulang dan tidak diinginkan. OCD dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tips untuk menangani OCD:

* Dapatkan pengobatan yang tepat dari dokter atau psikiater.
* Ikuti terapi perilaku kognitif (CBT).
* Lakukan teknik relaksasi, seperti yoga atau meditasi.
* Dapatkan dukungan dari orang-orang terdekat.

",
        "date": "2024-01-13"
    },
    {
        "title": "Tips Mengelola Gangguan Skizofrenia",
        "description":
        "Gangguan skizofrenia adalah kondisi kesehatan mental yang ditandai dengan halusinasi, delusi, dan gangguan berpikir. Skizofrenia dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tips untuk mengelola skizofrenia:

* Dapatkan pengobatan yang tepat dari dokter atau psikiater.
* Ikuti terapi perilaku kognitif (CBT).
* Lakukan teknik relaksasi, seperti yoga atau meditasi.
* Dapatkan dukungan dari orang-orang terdekat.

",
        "date": "2024-01-14"
    },
    {
        "title": "Cara Menangani Gangguan Makan",
        "description":
        "Gangguan makan adalah kondisi kesehatan mental yang ditandai dengan pola makan yang tidak sehat dan berbahaya. Gangguan makan dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tips untuk menangani gangguan makan:

* Dapatkan pengobatan yang tepat dari dokter atau psikiater.
* Ikuti terapi perilaku kognitif (CBT).
* Lakukan teknik relaksasi, seperti yoga atau meditasi.
* Dapatkan dukungan dari orang-orang terdekat.

",
        "date": "2024-01-15"
    },
    {
        "title": "Tips Mengelola Gangguan Kecemasan Perpisahan",
        "description":
        "Gangguan kecemasan perpisahan adalah kondisi yang ditandai dengan kecemasan yang berlebihan saat terpisah dari orang yang dicintai. Gangguan kecemasan perpisahan dapat memengaruhi anak-anak dan orang dewasa.

Berikut adalah beberapa tips untuk mengelola gangguan kecemasan perpisahan:

* Berikan anak atau orang dewasa yang mengalami gangguan kecemasan perpisahan rasa aman dan dukungan.
* Bantu anak atau orang dewasa tersebut untuk mengembangkan keterampilan koping.
* Jika gangguan kecemasan perpisahan cukup parah, pertimbangkan untuk mencari bantuan profesional.

",
        "date": "2024-01-16"
    },
    {
        "title": "Cara Menangani Insomnia",
        "description":
        "Insomnia adalah kondisi yang ditandai dengan kesulitan tidur atau tidur yang tidak nyenyak. Insomnia dapat memengaruhi berbagai aspek kehidupan, termasuk pekerjaan, sekolah, dan hubungan sosial.

Berikut adalah beberapa tips untuk menangani insomnia:

* Buatlah jadwal tidur dan bangun yang teratur.
* Hindari kafein dan alkohol sebelum tidur.
* Lakukan aktivitas yang menenangkan sebelum tidur.
* Ciptakan lingkungan tidur yang nyaman.

",
        "date": "2024-01-17"
    }
]
"""

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
  "title": "5 Cara Menjaga Kesehatan Mental di Era Digital",
  "image": "https://images.unsplash.com/photo-1642707735136-548d53a25125?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y291bnR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=80",
  "description": "Era digital telah membawa banyak kemudahan dan keuntungan, tetapi juga tantangan yang dapat berdampak pada kesehatan mental. Berikut adalah 5 cara untuk menjaga kesehatan mental di era digital:

* **Batasi penggunaan media sosial.** Media sosial dapat menjadi sumber stres dan kecemasan jika digunakan secara berlebihan. Batasi waktu penggunaan media sosial Anda, dan fokuslah pada aktivitas yang lebih positif.
* **Lakukan detoks digital secara berkala.** Beristirahat dari teknologi digital secara berkala dapat membantu Anda untuk relaks dan memulihkan energi.
* **Perhatikan pola makan dan tidur Anda.** Pola makan dan tidur yang sehat penting untuk menjaga kesehatan fisik dan mental. Pastikan Anda makan makanan yang bergizi dan tidur yang cukup.
* **Luangkan waktu untuk berolahraga.** Olahraga dapat membantu mengurangi stres dan meningkatkan mood.
* **Dukung diri sendiri dan orang lain.** Bersikaplah baik dan suportif terhadap diri sendiri dan orang lain. Ini dapat membantu Anda untuk merasa lebih bahagia dan terhubung.",
  "url": "https://www.alodokter.com/5-cara-menjaga-kesehatan-mental-di-era-digital",
  "date": "2023-12-19"
},
{
  "title": "10 Tanda-Tanda Depresi yang Harus Diwaspadai",
  "image": "https://images.unsplash.com/photo-1642707735136-548d53a25125?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YSB8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=80",
  "description": "Depresi adalah gangguan kesehatan mental yang ditandai dengan perasaan sedih, putus asa, dan kehilangan minat dalam aktivitas yang biasa dinikmati. Jika Anda mengalami beberapa tanda-tanda berikut, sebaiknya segera periksakan diri ke dokter atau psikolog:

* **Perasaan sedih, putus asa, atau hilang harapan yang berlangsung selama dua minggu atau lebih.**
* **Kehilangan minat atau kesenangan dalam aktivitas yang biasa dinikmati.**
* **Perubahan nafsu makan (lebih banyak atau lebih sedikit dari biasanya).**
* **Perubahan pola tidur (lebih banyak atau lebih sedikit dari biasanya).**
* **Kelelahan atau kehilangan energi.**
* **Kesulitan berkonsentrasi atau membuat keputusan.**
* **Pikiran atau keinginan untuk menyakiti diri sendiri atau orang lain.**
* **Gejala fisik, seperti sakit kepala, nyeri otot, atau masalah pencernaan.**

Jika Anda mengalami salah satu tanda-tanda di atas, jangan ragu untuk meminta bantuan profesional. Depresi dapat diobati, dan Anda tidak perlu melaluinya sendiri.",
  "url": "https://www.halodoc.com/kesehatan-mental/tanda-tanda-depresi",
  "date": "2023-12-20"
},
{
  "title": "8 Manfaat Meditasi untuk Kesehatan Mental",
  "image": "https://images.unsplash.com/photo-1525178529480-f2646c922546?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fG1hcnRpY2FsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  "description": "Meditasi adalah praktik yang melibatkan fokus pada saat ini dan kesadaran diri. Meditasi telah terbukti memiliki banyak manfaat untuk kesehatan mental, termasuk:

* **Mengurangi stres dan kecemasan**
* **Meningkatkan suasana hati**
* **Meningkatkan konsentrasi**
* **Meningkatkan kualitas tidur**
* **Meningkatkan kreativitas**
* **Meningkatkan empati**
* **Meningkatkan hubungan interpersonal**

Meditasi dapat dilakukan dengan berbagai cara, seperti meditasi duduk, meditasi berjalan, atau meditasi pernapasan. Jika Anda ingin mencoba meditasi, ada banyak sumber daya yang tersedia untuk membantu Anda memulai.",
  "url": "https://www.alodokter.com/manfaat-meditasi",
  "date": "2023-12-21"
},
{
  "title": "9 Tanda-Tanda Gangguan Kecemasan yang Harus Diwaspadai",
  "image": "https://images.unsplash.com/photo-1521950616879-e989d1309603?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE3fG1hcnRpY2FsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  "description": "Gangguan kecemasan adalah gangguan kesehatan mental yang ditandai dengan perasaan cemas atau khawatir yang berlebihan dan tidak proporsional terhadap situasinya. Jika Anda mengalami beberapa tanda-tanda berikut, sebaiknya segera periksakan diri ke dokter atau psikolog:

* **Perasaan cemas atau khawatir yang berlebihan dan tidak proporsional terhadap situasinya.**
* **Kesulitan mengendalikan pikiran atau kecemasan.**
* **Perubahan fisik, seperti detak jantung yang cepat, berkeringat, atau gemetar.**
* **Menghindari situasi atau tempat yang memicu kecemasan.**
* **Memiliki kesulitan berkonsentrasi atau membuat keputusan.**
* **Memiliki kesulitan tidur.**
* **Memiliki masalah di tempat kerja atau sekolah.**
* **Memiliki masalah hubungan interpersonal.**

Jika Anda mengalami salah satu tanda-tanda di atas, jangan ragu untuk meminta bantuan profesional. Gangguan kecemasan dapat diobati, dan Anda tidak perlu melaluinya sendiri.",
  "url": "https://www.halodoc.com/gangguan-mental/tanda-tanda-gangguan-kecemasan",
  "date": "2023-12-22"
},
{
  "title": "5 Cara Mengelola Stres di Masa Pandemi",
  "image": "https://images.unsplash.com/photo-1627796009036-0d757c95349?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE3fG1hcnRpY2FsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  "description": "Pandemi COVID-19 telah menyebabkan banyak perubahan dalam kehidupan kita, termasuk perubahan yang dapat menimbulkan stres. Berikut adalah beberapa cara untuk mengelola stres di masa pandemi:

* **Batasi paparan informasi tentang pandemi.** Terlalu banyak informasi tentang pandemi dapat membuat Anda merasa cemas atau khawatir.
* **Lakukan aktivitas yang Anda sukai.** Luangkan waktu untuk melakukan hal-hal yang membuat Anda bahagia dan rileks.
* **Hubungi orang yang Anda percayai.** Berbagi perasaan dengan orang yang Anda percayai dapat membantu Anda merasa lebih baik.
* **Luangkan waktu untuk diri sendiri.** Penting untuk meluangkan waktu untuk diri sendiri, bahkan di tengah kesibukan.
* **Carilah bantuan profesional jika diperlukan.** Jika Anda merasa stresnya tidak dapat diatasi sendiri, jangan ragu untuk mencari bantuan profesional.",
  "url": "https://www.alodokter.com/mengelola-stres-di-masa-pandemi",
  "date": "2023-12-23"
},
{
  "title": "7 Penyebab Gangguan Bipolar yang Perlu Anda Ketahui",
  "image": "https://images.unsplash.com/photo-1510860136024-68779491085e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTY4fG1hcnRpY2FsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
  "description": "Gangguan bipolar adalah gangguan kesehatan mental yang ditandai dengan perubahan suasana hati yang ekstrem, dari mania (senang dan bersemangat secara berlebihan) ke depresi (sedih dan putus asa). Penyebab gangguan bipolar masih belum sepenuhnya dipahami, tetapi ada beberapa faktor yang diduga berperan, termasuk:

* **Genetik.** Gangguan bipolar memiliki komponen genetik yang kuat. Jika Anda memiliki anggota keluarga yang menderita gangguan bipolar, Anda memiliki risiko lebih tinggi untuk mengalaminya.
* **Stres.** Stres dapat memicu episode mania atau depresi pada orang dengan gangguan bipolar.
* **Perubahan hormon.** Perubahan hormon, seperti yang terjadi selama kehamilan atau menopause, dapat memicu episode mania atau depresi pada orang dengan gangguan bipolar.
* **Penggunaan obat-obatan.** Beberapa obat-obatan, seperti obat-obatan terlarang, dapat memicu episode mania atau depresi pada orang dengan gangguan bipolar.
* **Cedera kepala.** Cedera kepala dapat meningkatkan risiko gangguan bipolar.

Jika Anda mengalami perubahan suasana hati yang ekstrem, sebaiknya segera periksakan diri ke dokter atau psikolog. Gangguan bipolar dapat diobati, dan Anda tidak perlu melaluinya sendiri.",
  "url": "https://www.alodokter.com/penyebab-gangguan-bipolar",
  "date": "2023-12-24"
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
            "emoticon": "\uD83D\uDE01",
            "cheking":false
            },
            {
        "days": "Selasa",
            "date":"04-12-2023",
            "emoticon":"❌",
            "cheking":true
            },
            {
        "days": "Rabu",
            "date":"05-12-2023",
            "emoticon": "\uD83D\uDE01",
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
            "emoticon": "\uD83D\uDE01",
            "cheking":false
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
val dataDummyConcultation = JSONArray(
    """
        [
    {"userid":"dsfgsgsdfs","name":"AI BOT","profile":"https://img.freepik.com/premium-vector/support-bot-ai-assistant-flat-icon-with-blue-support-bot-white-background_194782-1435.jpg", "date":"12-12-2022","post":"Saya adalah bot AI yang dilatih untuk memberikan saran tentang berbagai topik, termasuk kesehatan mental. Saya senang bisa membantu Anda dan orang lain."}
]
        """
)


val dummyMessages: List<Pair<String, Boolean>> = listOf(
    "Halo, saya merasa cemas setiap kali harus berbicara di depan banyak orang. Bagaimana cara mengatasi keringat dingin dan kecemasan ini?" to true,
    "Halo! Saya bisa membantu Anda dengan itu. Keringat dingin dan kecemasan adalah hal yang umum terjadi. Pertama, cobalah untuk bernapas dalam-dalam dan lambat ketika merasa cemas. Ini bisa membantu menenangkan diri Anda." to false,
    "Terima kasih atas saran tersebut. Saya juga khawatir tentang bagaimana penampilan saya di mata orang lain. Apa yang bisa saya lakukan untuk meningkatkan rasa percaya diri?" to true,
    "Itu masalah yang umum, percaya diri bisa ditingkatkan dengan latihan dan pengalaman. Cobalah untuk berbicara di depan cermin atau bergabung dengan kelompok berbicara untuk memperoleh kepercayaan diri yang lebih baik." to false,
    "Saya akan mencoba saran-saran itu. Apakah ada metode relaksasi khusus yang bisa saya coba sebelum presentasi?" to true,
    "Tentu, Anda bisa mencoba teknik meditasi atau yoga untuk meredakan stres sebelum presentasi. Pernapasan dalam-dalam juga membantu merilekskan tubuh dan pikiran." to false,
    "Terima kasih atas bantuan Anda! Saya merasa lebih siap untuk menghadapi presentasi berikutnya." to true,
    "Sangat senang bisa membantu Anda. Percayalah pada diri sendiri, Anda pasti akan melakukan dengan baik. Semoga sukses dalam presentasi Anda!" to false,
    "Apakah Anda punya saran lain untuk mengatasi kecemasan sosial selama pertemuan bisnis?" to true,
    "Tentu saja, selain latihan, cobalah untuk fokus pada pesan yang ingin Anda sampaikan daripada perasaan cemas. Ingat, orang lain mungkin juga merasa gugup. Dan jangan lupa untuk menjaga tubuh Anda tetap terhidrasi dan istirahat yang cukup." to false,
    "Saran itu masuk akal. Terkadang, saya juga merasa tidak bisa tidur sebelum presentasi. Apakah ada trik untuk mendapatkan tidur yang nyenyak?" to true,
    "Tentu, hindari kafein dan makanan berat sebelum tidur. Cobalah untuk membuat rutinitas tidur yang konsisten dan menciptakan lingkungan tidur yang nyaman. Ini akan membantu Anda tidur lebih nyenyak." to false,
    "Terima kasih atas semua tips ini. Saya akan mencobanya. Bagaimana Anda bisa sangat ahli dalam kesehatan mental?" to true,
    "Saya adalah bot AI yang dilatih untuk memberikan saran tentang berbagai topik, termasuk kesehatan mental. Saya senang bisa membantu Anda dan orang lain." to false
)
