package id.bangkit.soulbabble

import android.os.Bundle
import android.text.SpannableString
import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import android.text.Spanned
import android.text.method.LinkMovementMethod
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val termsText = findViewById<TextView>(R.id.termsAndPrivacyText)

        // Teks yang akan ditampilkan di TextView
        val text = "Dengan masuk ke halaman ini, kamu menyetujui Syarat Ketentuan dan Kebijakan Privasi"

        // Membuat SpannableString untuk teks
        val spannable = SpannableString(text)

        // Menentukan posisi teks "Syarat Ketentuan" dan "Kebijakan Privasi"
        val startTerms = text.indexOf("Syarat Ketentuan")
        val endTerms = startTerms + "Syarat Ketentuan".length

        val startPrivacy = text.indexOf("Kebijakan Privasi")
        val endPrivacy = startPrivacy + "Kebijakan Privasi".length

        // Menebalkan bagian "Syarat Ketentuan" dan "Kebijakan Privasi"
        spannable.setSpan(StyleSpan(android.graphics.Typeface.BOLD), startTerms, endTerms, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.setSpan(StyleSpan(android.graphics.Typeface.BOLD), startPrivacy, endPrivacy, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // Menambahkan warna hitam pada bagian "Syarat Ketentuan" dan "Kebijakan Privasi"
        val blackColor = ContextCompat.getColor(this, android.R.color.black) // Warna hitam
        spannable.setSpan(ForegroundColorSpan(blackColor), startTerms, endTerms, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.setSpan(ForegroundColorSpan(blackColor), startPrivacy, endPrivacy, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // Menambahkan ClickableSpan untuk bagian "Syarat Ketentuan"
        spannable.setSpan(object : android.text.style.ClickableSpan() {
            override fun onClick(widget: View) {
                // Tindakan ketika bagian "Syarat Ketentuan" diklik
                Toast.makeText(this@LoginActivity, "Klik pada Syarat Ketentuan", Toast.LENGTH_SHORT).show()
            }
        }, startTerms, endTerms, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // Menambahkan ClickableSpan untuk bagian "Kebijakan Privasi"
        spannable.setSpan(object : android.text.style.ClickableSpan() {
            override fun onClick(widget: View) {
                // Tindakan ketika bagian "Kebijakan Privasi" diklik
                Toast.makeText(this@LoginActivity, "Klik pada Kebijakan Privasi", Toast.LENGTH_SHORT).show()
            }
        }, startPrivacy, endPrivacy, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // Setel teks ke TextView
        termsText.text = spannable
        termsText.movementMethod = LinkMovementMethod.getInstance()
    }
}
