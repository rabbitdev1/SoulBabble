package id.soulbabble.bangkit.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.MutableLiveData
import id.soulbabble.bangkit.data.EmotionUserTrackData

class TrackingMoodViewModel : ViewModel() {
    private val _userListEmotionPositiveTrack = MutableLiveData<MutableList<String>?>()
    val userListEmotionPositiveTrack: MutableLiveData<MutableList<String>?> = _userListEmotionPositiveTrack

    private val _userListEmotionNegativeTrack = MutableLiveData<MutableList<String>?>()
    val userListEmotionNegativeTrack: MutableLiveData<MutableList<String>?> = _userListEmotionNegativeTrack

    private val _userListSourceEmotionTrack = MutableLiveData<MutableList<String>?>()
    val userListSourceEmotionTrack: MutableLiveData<MutableList<String>?> = _userListSourceEmotionTrack

    init {
        _userListEmotionPositiveTrack.value = mutableListOf()
        _userListEmotionNegativeTrack.value = mutableListOf()
        _userListSourceEmotionTrack.value = mutableListOf()
    }
    fun toggleEmotion(emotion: String, isPositive: Boolean) {
        val updatedList = if (isPositive) {
            _userListEmotionPositiveTrack.value?.toMutableList().apply {
                this?.let {
                    if (it.contains(emotion)) it.remove(emotion) else it.add(emotion)
                }
            }
        } else {
            _userListEmotionNegativeTrack.value?.toMutableList().apply {
                this?.let {
                    if (it.contains(emotion)) it.remove(emotion) else it.add(emotion)
                }
            }
        }

        if (isPositive) {
            _userListEmotionPositiveTrack.postValue(updatedList)
        } else {
            _userListEmotionNegativeTrack.postValue(updatedList)
        }
    }

    fun toggleSourceEmotion(emotion: String) {
        val updatedList = _userListSourceEmotionTrack.value?.toMutableList().apply {
            this?.let {
                if (it.contains(emotion)) it.remove(emotion) else it.add(emotion)
            }
        }
        _userListSourceEmotionTrack.postValue(updatedList)
    }


    fun getEmotionData(type: String): EmotionUserTrackData {
        val positiveList = _userListEmotionPositiveTrack.value ?: emptyList()
        val negativeList = _userListEmotionNegativeTrack.value ?: emptyList()
        val sourceEmotionList = _userListSourceEmotionTrack.value ?: emptyList()

        return EmotionUserTrackData(type, positiveList, negativeList, sourceEmotionList)
    }

}
