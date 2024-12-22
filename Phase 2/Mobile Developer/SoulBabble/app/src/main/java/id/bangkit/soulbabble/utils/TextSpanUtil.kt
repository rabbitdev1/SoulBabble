package id.bangkit.soulbabble.utils

import android.content.Context
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import androidx.core.content.ContextCompat
import id.bangkit.soulbabble.R

object TextSpanUtil {
    enum class ClickablePart {
        TERMS,
        PRIVACY
    }

    fun createTermsAndPrivacySpan(
        context: Context,
        onClick: (ClickablePart) -> Unit
    ): SpannableString {
        val text = "Dengan masuk ke halaman ini, kamu menyetujui Syarat Ketentuan dan Kebijakan Privasi"
        val spannable = SpannableString(text)

        // Menentukan posisi teks
        val startTerms = text.indexOf("Syarat Ketentuan")
        val endTerms = startTerms + "Syarat Ketentuan".length

        val startPrivacy = text.indexOf("Kebijakan Privasi")
        val endPrivacy = startPrivacy + "Kebijakan Privasi".length

        // Menebalkan teks
        spannable.setSpan(StyleSpan(android.graphics.Typeface.BOLD), startTerms, endTerms, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.setSpan(StyleSpan(android.graphics.Typeface.BOLD), startPrivacy, endPrivacy, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // Memberi warna
        val blackColor = ContextCompat.getColor(context, android.R.color.black)
        spannable.setSpan(ForegroundColorSpan(blackColor), startTerms, endTerms, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.setSpan(ForegroundColorSpan(blackColor), startPrivacy, endPrivacy, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // ClickableSpan untuk "Syarat Ketentuan"
        spannable.setSpan(object : android.text.style.ClickableSpan() {
            override fun onClick(widget: android.view.View) {
                onClick(ClickablePart.TERMS)
            }
        }, startTerms, endTerms, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        // ClickableSpan untuk "Kebijakan Privasi"
        spannable.setSpan(object : android.text.style.ClickableSpan() {
            override fun onClick(widget: android.view.View) {
                onClick(ClickablePart.PRIVACY)
            }
        }, startPrivacy, endPrivacy, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)

        return spannable
    }
}
