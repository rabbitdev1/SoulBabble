package id.bangkit.soulbabble.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.utils.TextSpanUtil

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val termsText = findViewById<TextView>(R.id.termsAndPrivacyText)
        val buttonGoogle: Button = findViewById(R.id.buttonGoogle)

        // Ambil SpannableString dari utilitas
        val spannable = TextSpanUtil.createTermsAndPrivacySpan(this) {
            when (it) {
                TextSpanUtil.ClickablePart.TERMS -> {
                    Toast.makeText(this, "Klik pada Syarat Ketentuan", Toast.LENGTH_SHORT).show()
                }
                TextSpanUtil.ClickablePart.PRIVACY -> {
                    Toast.makeText(this, "Klik pada Kebijakan Privasi", Toast.LENGTH_SHORT).show()
                }
            }
        }

        termsText.text = spannable
        termsText.movementMethod = android.text.method.LinkMovementMethod.getInstance()

        buttonGoogle.setOnClickListener {
            val intent = Intent(this@LoginActivity, HomeActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}
