package id.bangkit.soulbabble.utils

import org.json.JSONArray

fun getEmotionalFactorByIndex(emotionalFactors: JSONArray, index: Int): String {
    return try {
        if (index in 0 until emotionalFactors.length()) {
            emotionalFactors.getString(index) // Get the value at the given index
        } else {
            "Index Out of Bounds" // Handle invalid index
        }
    } catch (e: Exception) {
        "Error accessing factors" // Handle any unexpected errors
    }
}
