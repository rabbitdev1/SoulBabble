@file:Suppress("DEPRECATION")

package id.bangkit.soulbabble.ui

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.ui.Profile.KebijakanPrivacyActivity
import id.bangkit.soulbabble.ui.Profile.SyaratdanKetentuanActivity
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.LocalStorage
import id.bangkit.soulbabble.utils.TextSpanUtil
import id.bangkit.soulbabble.viewmodel.LoginViewModel

class LoginActivity : AppCompatActivity() {

    private lateinit var termsText: TextView
    private lateinit var buttonGoogle: Button
    private lateinit var progressBar: LinearLayout

    private lateinit var firebaseAuth: FirebaseAuth
    private lateinit var googleSignInClient: GoogleSignInClient
    private val loginViewModel: LoginViewModel by viewModels()

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        initializeViews()
        setupTermsAndPrivacyText()
        setupGoogleSignIn()

        firebaseAuth = FirebaseAuth.getInstance()

        observeViewModel()
    }

    private fun setupTermsAndPrivacyText() {
        val spannable = TextSpanUtil.createTermsAndPrivacySpan(this) { clickablePart ->
            when (clickablePart) {
                TextSpanUtil.ClickablePart.TERMS -> {
                    val intent = Intent(this, SyaratdanKetentuanActivity::class.java)
                    startActivity(intent)
                }

                TextSpanUtil.ClickablePart.PRIVACY -> {
                    val intent = Intent(this, KebijakanPrivacyActivity::class.java)
                    startActivity(intent)
                }
            }
        }
        termsText.text = spannable
        termsText.movementMethod = android.text.method.LinkMovementMethod.getInstance()
    }

    private fun initializeViews() {
        termsText = findViewById(R.id.termsAndPrivacyText)
        buttonGoogle = findViewById(R.id.buttonGoogle)
        progressBar = findViewById(R.id.progressBar)
    }


    private fun setupGoogleSignIn() {
        // Konfigurasi Google Sign-In
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id)) // Ganti dengan ID yang sesuai
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)

        buttonGoogle.setOnClickListener {
            progressBar.visibility = LinearLayout.VISIBLE
            startGoogleSignIn()
        }
    }

    private fun startGoogleSignIn() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    @Deprecated("This method has been deprecated in favor of using the Activity Result API\n      which brings increased type safety via an {@link ActivityResultContract} and the prebuilt\n      contracts for common intents available in\n      {@link androidx.activity.result.contract.ActivityResultContracts}, provides hooks for\n      testing, and allow receiving results in separate, testable classes independent from your\n      activity. Use\n      {@link #registerForActivityResult(ActivityResultContract, ActivityResultCallback)}\n      with the appropriate {@link ActivityResultContract} and handling the result in the\n      {@link ActivityResultCallback#onActivityResult(Object) callback}.")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(Exception::class.java)
                if (account != null) {
                    authenticateWithFirebase(account)
                }
            } catch (e: Exception) {
                progressBar.visibility = LinearLayout.GONE
                Toast.makeText(this, "Google Sign-In failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun authenticateWithFirebase(account: GoogleSignInAccount) {
        val credential = GoogleAuthProvider.getCredential(account.idToken, null)
        firebaseAuth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val user = firebaseAuth.currentUser
                    if (user != null) {
                        loginViewModel.sendLoginRequest(
                            uid = user.uid,
                            fullName = user.displayName ?: "Unknown",
                            email = user.email ?: "No Email",
                            photoUrl = user.photoUrl?.toString() ?: "No Photo URL"
                        )
                    }
                } else {
                    progressBar.visibility = LinearLayout.GONE
                    Toast.makeText(this, "Firebase Authentication failed", Toast.LENGTH_SHORT).show()
                }
            }
    }

    private fun observeViewModel() {
        loginViewModel.loginStatus.observe(this) { status ->
            progressBar.visibility = LinearLayout.GONE
            Toast.makeText(this, status, Toast.LENGTH_SHORT).show()
        }

        loginViewModel.userData.observe(this) { userData ->
            if (userData != null) {
                // Simpan data autentikasi ke SharedPreferences
                val uid = userData["uid"] ?: ""
                val apiKey = userData["apiKey"] ?: ""
                val token = userData["token"] ?: ""
                val fullName = userData["fullName"] ?: "Unknown"
                val email = userData["email"] ?: "No Email"
                val photoUrl = userData["photoUrl"] ?: "No Photo URL"

                AuthStorage.saveAuthData(this, uid, apiKey, token)
                LocalStorage.saveAuthData(this, fullName, email, photoUrl)

                navigateToHome()
            }
        }
    }


    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
        finish()
    }

    companion object {
        private const val RC_SIGN_IN = 9001
    }
}
