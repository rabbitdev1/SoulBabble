package id.soulbabble.bangkit.ui.consultation

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ChatScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
    @Test
    fun chatScreenTest() {
        composeTestRule.setContent {
            val navController = rememberNavController()
            ChatScreen(navController = navController)
        }

        val sendButton = composeTestRule.onNodeWithContentDescription("Send")

        composeTestRule.onNodeWithText("Chat Dengan AI").assertIsDisplayed()
        composeTestRule.onNodeWithContentDescription("Kembali").assertIsDisplayed()
        sendButton.assertExists()

        composeTestRule.onNode(hasText("Masukkan teks di sini")).performTextInput("Test Hello, AI!")
        sendButton.performClick()
        composeTestRule.onNode(hasText("Test Hello, AI!"))
    }
}