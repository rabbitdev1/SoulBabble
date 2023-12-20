package id.soulbabble.bangkit.ui.consultation

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.navigation.compose.rememberNavController
import id.soulbabble.bangkit.ui.journaling.ConsultationScreen
import org.junit.Rule
import org.junit.Test

class ConsultationScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @OptIn(ExperimentalFoundationApi::class, ExperimentalMaterial3Api::class)
    @Test
    fun consultationScreenTest() {
        composeTestRule.setContent {
            val navController = rememberNavController()
            ConsultationScreen(navController = navController)
        }
        composeTestRule.onNodeWithText("Consultation Bot").assertIsDisplayed()
        composeTestRule.onNodeWithContentDescription("Notifications").assertIsDisplayed()
//
//        // Validate the navigation to the chat-bot screen
//        composeTestRule.onNodeWithText("Chat Dengan AI").assertIsDisplayed()
    }
}