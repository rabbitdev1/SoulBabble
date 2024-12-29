-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 29 Des 2024 pada 09.43
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `soulbabble`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `ann_model`
--

CREATE TABLE `ann_model` (
  `id` int(11) NOT NULL,
  `trainingDataId` int(11) NOT NULL,
  `modelName` varchar(100) NOT NULL,
  `modelData` blob NOT NULL,
  `accuracy` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `emotion`
--

CREATE TABLE `emotion` (
  `id` int(11) NOT NULL,
  `emotionName` varchar(50) NOT NULL,
  `intensity` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `emotion`
--

INSERT INTO `emotion` (`id`, `emotionName`, `intensity`, `description`, `createdAt`) VALUES
(2, 'Sangat Buruk', '1', 'tingkat emosi yang paling rendah, menunjukkan perasaan yang sangat buruk atau sangat tidak puas. Seseorang yang merasakan emosi ini mungkin merasa sangat tertekan, kecewa, atau frustasi.', '2024-12-17 09:53:30'),
(3, 'Buruk', '2', 'Emosi ini menunjukkan kondisi yang buruk namun tidak seburuk \"Sangat Buruk\". Seseorang dalam keadaan ini mungkin merasa kecewa atau tidak puas, tetapi masih dapat menghadapinya.', '2024-12-17 09:53:30'),
(4, 'Netral', '3', 'Emosi ini menggambarkan keadaan yang seimbang tanpa perasaan kuat, baik itu positif atau negatif. Orang yang merasa netral mungkin tidak merasakan apapun yang luar biasa, seperti pada kondisi tenang atau tidak terpengaruh oleh situasi tertentu.', '2024-12-17 09:53:30'),
(5, 'Baik', '4', 'Emosi ini menunjukkan keadaan yang positif dan memuaskan. Seseorang yang merasakan emosi ini mungkin merasa bahagia, puas, atau senang dengan situasi yang ada.', '2024-12-17 09:53:30'),
(6, 'Sangat Baik', '5', 'emosi yang paling tinggi, menunjukkan perasaan luar biasa baik dan bahagia. Orang yang merasakan emosi ini merasa sangat puas, optimis, dan sangat positif terhadap keadaan mereka.', '2024-12-17 09:53:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `journaling`
--

CREATE TABLE `journaling` (
  `id` int(11) NOT NULL,
  `apiKey` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `analysisResult` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `journaling`
--

INSERT INTO `journaling` (`id`, `apiKey`, `title`, `content`, `analysisResult`, `createdAt`) VALUES
(1, 'APWVZCUEIUQDLZQGOMXC', 'Refleksi Panjang Hari Ini dan Hal-Hal yang Membuat Saya Bersyukur', '{\"jurnal1\":\"Hari ini saya memulai pagi dengan segelas kopi hangat dan sebuah buku inspiratif. Pekerjaan berjalan cukup lancar meskipun ada beberapa tantangan yang harus dihadapi. Saya juga belajar tentang pentingnya menjaga komunikasi dengan rekan kerja.\",\"jurnal2\":\"Sore ini saya pergi berjalan-jalan ke taman. Angin sepoi-sepoi dan suara burung membuat suasana sangat damai. Saya juga menulis beberapa ide baru untuk proyek yang sedang saya kerjakan. Hari ini benar-benar mengingatkan saya untuk tetap bersyukur.\"}', 'Sangat Baik', '2024-12-24 19:40:41'),
(2, 'APWVZCUEIUQDLZQGOMXC', 'Pengalaman Berharga dan Refleksi Mingguan', '{\"jurnal1\":\"Minggu ini dipenuhi dengan banyak pelajaran baru. Saya menghadiri dua seminar yang membahas pengembangan diri dan bagaimana cara menjadi pribadi yang lebih baik. Saya merasa semakin termotivasi untuk melangkah ke depan.\",\"jurnal2\":\"Pada akhir pekan, saya menghabiskan waktu bersama keluarga. Kami membuat hidangan spesial dan bermain bersama di halaman belakang. Pengalaman ini membuat saya merasa sangat dekat dengan keluarga dan memahami pentingnya meluangkan waktu untuk mereka.\"}', 'Baik', '2024-12-25 19:40:41'),
(3, 'APWVZCUEIUQDLZQGOMXC', 'Hari-Hari Penuh Tantangan dan Pelajaran', '{\"jurnal1\":\"Pagi ini dimulai dengan banyak tugas mendadak yang perlu diselesaikan. Saya merasa sedikit kewalahan, tetapi dengan bantuan tim, semuanya bisa diselesaikan tepat waktu. Saya belajar untuk lebih mengatur prioritas.\",\"jurnal2\":\"Di malam hari, saya merefleksikan semua yang terjadi hari ini. Saya menyadari bahwa tantangan adalah bagian dari perjalanan dan justru menjadi kesempatan untuk belajar. Saya berterima kasih kepada semua orang yang mendukung saya hari ini.\"}', 'Baik', '2024-12-26 19:40:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `apiKey` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `type` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `notification`
--

INSERT INTO `notification` (`id`, `apiKey`, `content`, `type`, `status`, `createdAt`) VALUES
(2, 'APWVZCUEIUQDLZQGOMXC', 'Lakukan tracking mood untuk hari ini dan catat emosi yang kamu rasakan.', 0, 1, '2024-12-25 00:00:00'),
(3, 'APWVZCUEIUQDLZQGOMXC', 'Jangan lupa untuk membuat jurnal singkat tentang apa yang kamu syukuri hari ini.', 0, 1, '2024-12-26 00:00:00'),
(4, 'APWVZCUEIUQDLZQGOMXC', 'Catat suasana hati kamu selama bekerja atau belajar hari ini.', 0, 1, '2024-12-27 00:00:00'),
(5, 'APWVZCUEIUQDLZQGOMXC', 'Refleksikan momen terbaik yang terjadi di tengah aktivitasmu hari ini.', 0, 1, '2024-12-28 00:00:00'),
(6, 'APWVZCUEIUQDLZQGOMXC', 'Bagikan pengalaman yang membuat kamu merasa bahagia atau sedih hari ini dalam jurnalmu.', 0, 1, '2024-12-29 00:00:00'),
(7, 'APWVZCUEIUQDLZQGOMXC', 'Luangkan waktu untuk menulis apa yang kamu pelajari selama seminggu ini.', 0, 1, '2024-12-30 00:00:00'),
(8, 'APWVZCUEIUQDLZQGOMXC', 'Tutup minggu ini dengan mencatat harapan atau tujuan kamu untuk minggu depan.', 0, 1, '2024-12-31 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `recommendations`
--

CREATE TABLE `recommendations` (
  `id` int(11) NOT NULL,
  `apiKey` varchar(100) NOT NULL,
  `trackingId` int(11) NOT NULL,
  `journalingId` int(11) NOT NULL,
  `recommendedAction` text NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `recommendations`
--

INSERT INTO `recommendations` (`id`, `apiKey`, `trackingId`, `journalingId`, `recommendedAction`, `url`, `type`, `createdAt`) VALUES
(1, 'APWVZCUEIUQDLZQGOMXC', 1, 0, '{\"title\":\"The Pursuit of Happyness\",\"desc\":\"Film ini menceritakan perjalanan seorang ayah yang berjuang untuk mengatasi kesulitan hidup demi memberikan masa depan yang lebih baik untuk anaknya. Film penuh inspirasi dan pelajaran hidup yang mengajarkan tentang ketekunan dan cinta tanpa syarat.\",\"image\":\"https://picsum.photos/id/237/200/300\"}', '\"https://example.com/movie-recommendation\"', 'movie', '2024-12-17 10:49:09'),
(2, 'APWVZCUEIUQDLZQGOMXC', 1, 0, '{\"title\":\"Atomic Habits\",\"desc\":\"Buku ini memberikan panduan praktis tentang cara membangun kebiasaan baik dan menghancurkan kebiasaan buruk. Ditulis oleh James Clear, buku ini penuh dengan contoh nyata dan strategi yang dapat diterapkan untuk meraih perubahan besar dalam hidup.\",\"image\":\"https://picsum.photos/id/1012/200/300\"}', '\"https://example.com/movie-recommendation\"', 'book', '2024-12-17 10:49:09'),
(3, 'APWVZCUEIUQDLZQGOMXC', 1, 0, '{\"title\":\"How I Built This\",\"desc\":\"Podcast ini mengisahkan perjalanan para pengusaha dan inovator dalam membangun bisnis mereka dari nol. Dengan cerita yang inspiratif dan wawasan mendalam, podcast ini cocok untuk siapa saja yang ingin belajar tentang kewirausahaan.\",\"image\":\"https://picsum.photos/id/1005/200/300\"},', '\"https://example.com/movie-recommendation\"', 'podcash', '2024-12-17 10:49:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tracking_mood`
--

CREATE TABLE `tracking_mood` (
  `id` int(11) NOT NULL,
  `apiKey` varchar(100) NOT NULL,
  `emotionName` varchar(50) NOT NULL,
  `resultedEmotion` text NOT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tracking_mood`
--

INSERT INTO `tracking_mood` (`id`, `apiKey`, `emotionName`, `resultedEmotion`, `createdAt`) VALUES
(1, 'APWVZCUEIUQDLZQGOMXC', 'Sangat Buruk', '{\"emoji\":\"😠\",\"emotionalFactor\":[\"Sangat Buruk\",\"Menyebalkan\",\"Sekolah\"],\"resultQuestion\":[{\"question\":\"Apa yang membuat kamu marah?\",\"answer\":\"Tugas sekolah yang terlalu banyak dan mendesak.\"},{\"question\":\"Bagaimana situasi ini memengaruhi perasaan kamu?\",\"answer\":\"Saya merasa sangat tertekan dan sulit untuk berkonsentrasi.\"},{\"question\":\"Apa yang bisa membantu kamu mengatasi perasaan ini?\",\"answer\":\"Mengatur waktu dengan lebih baik dan meminta bantuan teman atau guru.\"},{\"question\":\"Apakah kamu ingin membagikan pengalaman ini kepada seseorang?\",\"answer\":\"Ya, saya ingin berbicara dengan teman dekat atau konselor sekolah.\"}],\"msgEmotion\":\"Kamu merasa percaya diri dan berharap yang terbaik untuk masa depan.\",\"recommendations\":[{\"title\":\"Cinta di Langit Biru\",\"image\":\"https://example.com/cinta_di_langit_biru.jpg\",\"desc\":\"Film romantis yang ringan dan bisa membantu meredakan perasaan malu dan gugup.\"},{\"title\":\"Dendam Siapa Takut\",\"image\":\"https://example.com/dendam_siapatakut.jpg\",\"desc\":\"Film yang penuh dengan ketegangan dan konflik yang bisa menyalurkan emosi marah dan kesal.\"},{\"title\":\"Garis Waktu\",\"image\":\"https://example.com/garis_waktu.jpg\",\"desc\":\"Film yang penuh dengan kejutan, tantangan, dan bisa membuatmu merasa gemas dan terharu.\"},{\"title\":\"Gundala\",\"image\":\"https://example.com/gundala.jpg\",\"desc\":\"Film superhero Indonesia yang penuh dengan harapan dan cerita yang menarik.\"},{\"title\":\"Dilan 1990\",\"image\":\"https://example.com/dilan_1990.jpg\",\"desc\":\"Film romantis yang menggugah emosi, cocok untuk yang sedang merasa kecewa dan sedih.\"}]}', '2024-12-26 11:12:29'),
(4, 'APWVZCUEIUQDLZQGOMXC', 'Buruk', '{\"emoji\":\"😠\",\"emotionalFactor\":[\"Buruk\",\"Menyebalkan\",\"Sekolah\"],\"resultQuestion\":[{\"question\":\"Apa yang membuat kamu merasa sangat buruk?\",\"answer\":\"Tugas sekolah yang menumpuk tanpa ada waktu istirahat.\"},{\"question\":\"Bagaimana situasi ini memengaruhi perasaan kamu?\",\"answer\":\"Saya merasa putus asa dan tidak bisa fokus.\"},{\"question\":\"Apa yang bisa membantu kamu mengatasi perasaan ini?\",\"answer\":\"Beristirahat sejenak dan berbicara dengan teman.\"}],\"msgEmotion\":\"Kamu merasa sangat terbebani dengan situasi ini.\",\"recommendations\":[{\"title\":\"Film Penyemangat\",\"image\":\"https://example.com/motivasi.jpg\",\"desc\":\"Film yang memberikan semangat untuk bangkit kembali.\"}]}', '2024-12-22 11:12:29'),
(5, 'APWVZCUEIUQDLZQGOMXC', 'Netral', '{\"emoji\":\"😐\",\"emotionalFactor\":[\"Rutinitas\",\"Biasa Saja\",\"Rumah\"],\"resultQuestion\":[{\"question\":\"Apa yang membuat kamu merasa netral?\",\"answer\":\"Hari ini berjalan seperti biasa tanpa kejadian berarti.\"},{\"question\":\"Bagaimana situasi ini memengaruhi perasaan kamu?\",\"answer\":\"Saya merasa biasa saja, tidak ada yang terlalu menyenangkan atau menyedihkan.\"},{\"question\":\"Apa yang bisa membantu kamu meningkatkan suasana hati?\",\"answer\":\"Melakukan hobi atau mencoba sesuatu yang baru.\"}],\"msgEmotion\":\"Kamu menjalani hari dengan tenang tanpa banyak gangguan.\",\"recommendations\":[{\"title\":\"Podcast Inspirasi\",\"image\":\"https://example.com/inspirasi.jpg\",\"desc\":\"Podcast yang memberikan wawasan baru dan inspirasi.\"}]}', '2024-12-23 11:12:29'),
(6, 'APWVZCUEIUQDLZQGOMXC', 'Baik', '{\"emoji\":\"😊\",\"emotionalFactor\":[\"Kegembiraan\",\"Penghargaan\",\"Keluarga\"],\"resultQuestion\":[{\"question\":\"Apa yang membuat kamu merasa baik?\",\"answer\":\"Menghabiskan waktu bersama keluarga yang menyenangkan.\"},{\"question\":\"Bagaimana situasi ini memengaruhi perasaan kamu?\",\"answer\":\"Saya merasa lebih bahagia dan berenergi.\"},{\"question\":\"Apa yang bisa membantu kamu mempertahankan suasana hati ini?\",\"answer\":\"Melanjutkan aktivitas positif dan menghargai momen ini.\"}],\"msgEmotion\":\"Kamu menikmati hari ini dengan suasana hati yang baik.\",\"recommendations\":[{\"title\":\"Film Keluarga\",\"image\":\"https://example.com/keluarga.jpg\",\"desc\":\"Film yang cocok untuk ditonton bersama orang-orang terdekat.\"}]}', '2024-12-24 11:12:29'),
(7, 'APWVZCUEIUQDLZQGOMXC', 'Sangat Baik', '{\"emoji\":\"😃\",\"emotionalFactor\":[\"Keberhasilan\",\"Kemenangan\",\"Pekerjaan\"],\"resultQuestion\":[{\"question\":\"Apa yang membuat kamu merasa sangat baik?\",\"answer\":\"Mencapai target besar di tempat kerja.\"},{\"question\":\"Bagaimana situasi ini memengaruhi perasaan kamu?\",\"answer\":\"Saya merasa sangat bangga dan puas dengan hasil kerja keras.\"},{\"question\":\"Apa yang bisa membantu kamu mempertahankan suasana hati ini?\",\"answer\":\"Merayakan pencapaian ini dengan orang-orang terdekat.\"}],\"msgEmotion\":\"Kamu merasa sangat percaya diri dan siap untuk tantangan berikutnya.\",\"recommendations\":[{\"title\":\"Film Inspiratif\",\"image\":\"https://example.com/inspirasi_film.jpg\",\"desc\":\"Film yang menginspirasi untuk terus melangkah maju.\"}]}', '2024-12-25 11:12:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `training_data`
--

CREATE TABLE `training_data` (
  `id` int(11) NOT NULL,
  `inputText` text NOT NULL,
  `outputText` text NOT NULL,
  `emotionId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `UID` varchar(100) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `apiKey` varchar(100) NOT NULL,
  `photoUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `UID`, `fullName`, `email`, `apiKey`, `photoUrl`) VALUES
(4, '12345678', 'Rizal Sujana', 'zalsujana07@gmail.com', 'APWVZCUEIUQDLZQGOMXC', 'https://lh3.googleusercontent.com/a/ACg8ocKF14IBY_twrlLJjnW157Fsvzyh5x892M-_mgfjtCOEurPGrxUr=s192-c-rg-br100');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `ann_model`
--
ALTER TABLE `ann_model`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `emotion`
--
ALTER TABLE `emotion`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `journaling`
--
ALTER TABLE `journaling`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tracking_mood`
--
ALTER TABLE `tracking_mood`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `training_data`
--
ALTER TABLE `training_data`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `ann_model`
--
ALTER TABLE `ann_model`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `emotion`
--
ALTER TABLE `emotion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `journaling`
--
ALTER TABLE `journaling`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `tracking_mood`
--
ALTER TABLE `tracking_mood`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `training_data`
--
ALTER TABLE `training_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
