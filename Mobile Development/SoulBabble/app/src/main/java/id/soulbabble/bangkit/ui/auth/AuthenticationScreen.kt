package id.soulbabble.bangkit.ui.auth

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import id.soulbabble.bangkit.utils.PreferenceManager
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.ui.utils.ToastUtils

@Composable
fun Authentication(
    navController: NavHostController,
) {
    val viewModel: AuthenticationViewModel = viewModel()
    val authenticationState = viewModel.authenticationState.observeAsState()
    val navigateToHome by viewModel.navigateToHome.observeAsState()
    val context = LocalContext.current
    val token = stringResource(R.string.web_client_id)
    val isLoading by viewModel.isLoading.observeAsState(false)

    val toastMessage by viewModel.toastMessage.observeAsState()

    toastMessage?.let {
            ToastUtils.showToast(LocalContext.current, it)
            viewModel.resetToastMessage()
    }

    LaunchedEffect(authenticationState.value) {
        when (authenticationState.value) {
            AuthenticationViewModel.AuthenticationState.AUTHENTICATED -> {
                val user = FirebaseAuth.getInstance().currentUser
                user?.let {
                    PreferenceManager.saveUserProfile(
                        context,
                        it.uid,
                        it.displayName,
                        it.email,
                        it.photoUrl
                    )
                }
            }
            else -> {}
        }
    }
    LaunchedEffect(navigateToHome) {
        if (navigateToHome == true) {
            navController.navigate("home") {
                popUpTo("auth") { inclusive = true }
            }
        }
    }
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { activityResult ->
        if (activityResult.resultCode == Activity.RESULT_OK) {
            try {
                val account = GoogleSignIn.getSignedInAccountFromIntent(activityResult.data)
                    .getResult(ApiException::class.java)
                viewModel.authenticateWithGoogle(account)
            } catch (e: ApiException) {
                viewModel.setLoading(false)
                Log.w("TAG", "Google Sign-in Failed: ${e.message}", e)
            }
        } else {
            viewModel.setLoading(false)
            Log.d("TAG", "User cancelled the sign-in process")
        }
    }
    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Bottom
    ) {
        Image(
            painter = painterResource(id = R.drawable.iconlogodark),
            contentDescription = "App Bg",
            modifier = Modifier
                .weight(1f)
                .size(180.dp)
                .scale(1.5f),
        )
        Card(
            modifier = Modifier
                .weight(0.7f)
                .padding(start = 8.dp, end = 8.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.secondary,
            ),
        ) {
            Column(
                Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = stringResource(id = R.string.app_name),
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    fontSize = 30.sp,
                    modifier = Modifier
                        .padding()
                        .fillMaxWidth()
                        .wrapContentSize(Alignment.Center)
                )
                Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                Text(
                    text = "Login Dengan :",
                    color = MaterialTheme.colorScheme.primary,
                    textAlign = TextAlign.Center,
                    fontSize = 14.sp
                )
                Spacer(Modifier.size(ButtonDefaults.IconSpacing))
                GoogleSignInButton(
                    launcher = launcher,
                    token = token,
                    context = context,
                    isLoading = isLoading,
                    onLoadingChange = viewModel::setLoading
                )
                Spacer(Modifier.size(8.dp))
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    val annotatedString = buildAnnotatedString {
                        append("Dengan masuk ke halaman ini, Anda menyetujui ")
                        withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                            append("Ketentuan Layanan")
                        }
                        append(" dan ")
                        withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                            append("Kebijakan Privasi")
                        }
                    }
                    Text(
                        text = annotatedString,
                        color = MaterialTheme.colorScheme.primary,
                        textAlign = TextAlign.Center,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}

@Composable
fun GoogleSignInButton(
    launcher: ActivityResultLauncher<Intent>,
    token: String,
    context: Context,
    isLoading: Boolean,
    onLoadingChange: (Boolean) -> Unit
) {

    if (isLoading) {
        // Display a loading indicator
        CircularProgressIndicator()
    } else {
        // Display the Google Sign-In Button
        Button(
            onClick = {
                onLoadingChange(true)
                val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(token)
                    .requestEmail()
                    .build()
                val googleSignInClient = GoogleSignIn.getClient(context, gso)
                launcher.launch(googleSignInClient.signInIntent)
            },
            colors = ButtonDefaults.buttonColors(MaterialTheme.colorScheme.onPrimary)
        ) {
            Icon(
                modifier = Modifier
                    .width(20.dp)
                    .height(20.dp),
                painter = painterResource(id = R.drawable.ic_google),
                contentDescription = "Google sign-in",
                tint = Color.Unspecified
            )
            Spacer(Modifier.size(ButtonDefaults.IconSpacing))
            Text(
                text = "Sign in with Google",
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center
            )
        }
    }
}
