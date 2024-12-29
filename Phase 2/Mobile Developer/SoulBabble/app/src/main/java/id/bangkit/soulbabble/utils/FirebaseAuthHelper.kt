package id.bangkit.soulbabble.utils

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider

class FirebaseAuthHelper(private val context: Context) {

    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()

    fun firebaseAuthWithGoogle(account: GoogleSignInAccount, onSuccess: () -> Unit, onFailure: (Exception?) -> Unit) {
        val credential = GoogleAuthProvider.getCredential(account.idToken, null)
        firebaseAuth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Toast.makeText(context, "Welcome, ${firebaseAuth.currentUser?.displayName}", Toast.LENGTH_SHORT).show()
                    onSuccess()
                } else {
                    Log.e(TAG, "Authentication failed", task.exception)
                    Toast.makeText(context, "Authentication failed", Toast.LENGTH_SHORT).show()
                    onFailure(task.exception)
                }
            }
    }

    companion object {
        private const val TAG = "FirebaseAuthHelper"
    }
}
