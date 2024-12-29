package id.bangkit.soulbabble.ui.BottomTab

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsetsController
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.cardview.widget.CardView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.squareup.picasso.Picasso
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.ui.LoginActivity
import id.bangkit.soulbabble.ui.Profile.DetailProfileActivity
import id.bangkit.soulbabble.ui.Profile.KebijakanPrivacyActivity
import id.bangkit.soulbabble.ui.Profile.PusatBantuanActivity
import id.bangkit.soulbabble.ui.Profile.SyaratdanKetentuanActivity
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.LocalStorage
import id.bangkit.soulbabble.utils.LocalStorage.getAuthData
import id.bangkit.soulbabble.utils.StatusBarUtils
import id.bangkit.soulbabble.utils.setupToolbar

class ProfileFragment : Fragment(R.layout.fragment_profile) {
    private lateinit var tvFullName: TextView
    private lateinit var tvEmail: TextView
    private lateinit var imgProfile: ImageView

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // Setup your fragment here
        val toolbar: androidx.appcompat.widget.Toolbar = view.findViewById(R.id.topAppBar)
        tvFullName = view.findViewById(R.id.tvFullname)
        imgProfile = view.findViewById(R.id.imgProfile)
        tvEmail = view.findViewById(R.id.tvEmail)

        activity?.window?.let { window ->
            StatusBarUtils.setupStatusBar(window, requireContext(), R.color.primary)
        }

        toolbar.setOnApplyWindowInsetsListener { v, insets ->
            val statusBarHeight = insets.systemWindowInsetTop
            val layoutParams = v.layoutParams as ViewGroup.MarginLayoutParams
            layoutParams.topMargin = statusBarHeight
            v.layoutParams = layoutParams
            insets
        }

        val authData = getAuthData(requireContext())
        val fullName = authData[LocalStorage.FULL_NAME] ?: "Unknown Name"
        val email = authData[LocalStorage.EMAIL] ?: "Unknown Email"
        val profileImage = authData[LocalStorage.PHOTO_URL]

        tvFullName.text = fullName
        tvEmail.text = email

        if (!profileImage.isNullOrEmpty()) {
            Picasso.get()
                .load(profileImage)
                .placeholder(R.drawable.ic_launcher_background)
                .error(R.drawable.ic_launcher_background)
                .into(imgProfile)
        } else {
            imgProfile.setImageResource(R.drawable.ic_launcher_background)
        }


        val btnDetailProfile: CardView = view.findViewById(R.id.btnDetailProfile)
        btnDetailProfile.setOnClickListener {
            val intent = Intent(requireContext(), DetailProfileActivity::class.java)
            startActivity(intent)
        }
        val btnpusatBantuan: LinearLayout = view.findViewById(R.id.btnpusatBantuan)
        btnpusatBantuan.setOnClickListener {
            val intent = Intent(requireContext(), PusatBantuanActivity::class.java)
            startActivity(intent)
        }
        val btnKebijakanPrivasi: LinearLayout = view.findViewById(R.id.btnKebijakanPrivasi)
        btnKebijakanPrivasi.setOnClickListener {
            val intent = Intent(requireContext(), KebijakanPrivacyActivity::class.java)
            startActivity(intent)

        }
        val btnSyaratKetentuan: LinearLayout = view.findViewById(R.id.btnSyaratKetentuan)
        btnSyaratKetentuan.setOnClickListener {
            val intent = Intent(requireContext(), SyaratdanKetentuanActivity::class.java)
            startActivity(intent)
        }

        val btnExitAccount: LinearLayout = view.findViewById(R.id.btnExitAccount)
        btnExitAccount.setOnClickListener {

            logoutFromGoogleAndFirebase()
            // Hapus data dari AuthStorage
            AuthStorage.clearAuthData(requireContext())

            // Hapus data dari LocalStorage
            val sharedPreferences =
                requireContext().getSharedPreferences(LocalStorage.PREF_NAME, Context.MODE_PRIVATE)
            sharedPreferences.edit().clear().apply()

            // Kembali ke halaman login
            val intent = Intent(requireContext(), LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }
    private fun logoutFromGoogleAndFirebase() {
        // Inisialisasi GoogleSignInClient
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id)) // ID dari google-services.json
            .requestEmail()
            .build()

        val googleSignInClient = GoogleSignIn.getClient(requireContext(), gso)

        // Logout dari Google
        googleSignInClient.signOut().addOnCompleteListener {
            // Logout dari Firebase
            FirebaseAuth.getInstance().signOut()
            Toast.makeText(requireContext(), "Logged out successfully", Toast.LENGTH_SHORT).show()
        }
    }

}
