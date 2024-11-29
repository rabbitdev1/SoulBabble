package id.soulbabble.bangkit.ui.tracker

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import co.yml.charts.axis.AxisData
import co.yml.charts.common.model.Point
import co.yml.charts.ui.linechart.LineChart
import co.yml.charts.ui.linechart.model.GridLines
import co.yml.charts.ui.linechart.model.IntersectionPoint
import co.yml.charts.ui.linechart.model.Line
import co.yml.charts.ui.linechart.model.LineChartData
import co.yml.charts.ui.linechart.model.LinePlotData
import co.yml.charts.ui.linechart.model.LineStyle
import co.yml.charts.ui.linechart.model.SelectionHighlightPoint
import co.yml.charts.ui.linechart.model.SelectionHighlightPopUp
import co.yml.charts.ui.linechart.model.ShadowUnderLine
import id.soulbabble.bangkit.R

val pointsData: List<Point> = List(30) { i ->
    Point(i.toFloat(), (i % 5 + 1).toFloat())
}

val xAxisData = AxisData.Builder()
    .axisStepSize(20.dp)
    .steps(pointsData.size - 1)
    .labelData { i -> i.toString() }
    .labelAndAxisLinePadding(15.dp)
    .build()

val yAxisData = AxisData.Builder()
    .steps(5)
    .labelAndAxisLinePadding(15.dp)
    .labelData { i ->
        when (i) {
            1 -> "\uD83D\uDE14"
            2 -> "\uD83E\uDD72"
            3 -> "\uD83D\uDE42"
            4 -> "\uD83D\uDE0A"
            5 -> "\uD83D\uDE01"
            else -> ""  // Fallback for any other number
        }
    }
    .build()



val lineChartData = LineChartData(
    linePlotData = LinePlotData(
        lines = listOf(
            Line(
                dataPoints = pointsData,
                LineStyle(),
                IntersectionPoint(),
                SelectionHighlightPoint(),
                ShadowUnderLine(),
                SelectionHighlightPopUp()
            )
        ),
    ),
    xAxisData = xAxisData,
    yAxisData = yAxisData,
    gridLines = GridLines(),
    backgroundColor = Color.White
)
@Composable
fun EmoticonChart() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                MaterialTheme.colorScheme.onPrimary,
                shape = RoundedCornerShape(8.dp)
            )
            .border(
                width = 1.dp,
                color = Color(0xFFDADADA),
                shape = RoundedCornerShape(8.dp)
            ),
    ){
        LineChart(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp),
            lineChartData = lineChartData
        )
        Text(
            text = "Desember 2023",
            color = MaterialTheme.colorScheme.onBackground,
            style = TextStyle(
                fontFamily = FontFamily(Font(R.font.plus_jakarta_sans)),
                fontWeight = FontWeight.Normal,
                fontSize = 14.sp
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
                .wrapContentWidth(Alignment.CenterHorizontally)
        )

    }
}
