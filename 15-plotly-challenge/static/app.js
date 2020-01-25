// set area for the dashboard
var svgWidth = 950;
var svgHeight = 500;


// create a function for drawing the bar graph
function drawBargraph(ID)
{
    console.log ("Draw bar graph using sample :", ID);
    d3.json("samples.json").then((data) =>
    {
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObj => sampleObj.id == ID);
        var result = resultsArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [
            {
                x: sample_values.slice(0,10).reverse(),
                y: yticks,
                type: "bar",
                text: otu_labels.slice(0,10).reverse(),
                orientation: "h"
            }
        ]
        var barLayout = {
            title: "Top 10 Bacteria Cultures",
            margin: {t: 30, l:150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });

}

// create a function for creating a bubble chart
function drawBubblechart(ID)
{
    console.log ("Draw bubble chart using sample: ", ID);
    d3.json("samples.json").then ((data) =>
    {
        var samples = data.samples;
        var resultsArray = samples.filter (sampleObj => sampleObj.id == ID);
        var result = resultsArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        console.log("sample values: ", sample_values);

        var bubbleData = [
            {
                x:otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        var bubbleLayout = 
        {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t: 30}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}


// create a function for displaying the sample meta data for a given sample
function displaySampleData(ID)
{
    console.log ("Display sample data using sample: ", ID);
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id == ID);
        var result = resultArray[0];
        console.log(result);
        var demogTable = d3.select("#sample-metadata");

        // clear the tablet for each selection
        demogTable.html("");


        // use the key/value pair to populate the demographic table
        Object.entries(result).forEach(([key, value]) => {
            var infoItem = `${key.toUpperCase()}: ${value}`;
            demogTable.append("h6").text(infoItem);
        });
    });
}

// Bonus:Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ to plot the weekly washing frequency of the individual.
//You will need to modify the example gauge code to account for values ranging from 0 through 9.
//Update the chart whenever a new sample is selected.
function drawGaugeChart(ID)
{

  console.log("Drawing gauge chart using sample: ", ID);
  d3.json("samples.json").then((data) => 
  {
      var metadata = data.metadata;

      var resultArray = metadata.filter(sampleObj => sampleObj.id == ID);
      var result = resultArray[0];
      var wfreq = result.wfreq;
      var guageData = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wfreq,
          title: { text: "Belly Button Washing Fequency", font: { size: 20 }, color: "black" },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "green" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
        
            steps: [
              { range: [0, 1], color: "red"},
              { range: [1, 2], color: "pink"},
              { range: [2, 3], color: "orange"},
              { range: [3, 4], color: "gold"},
              { range: [4, 5], color: "yellow"},
              { range: [5, 6], color: "lightgreen"},
              { range: [6, 7], color: "yellowgreen"},
              { range: [7, 8], color: "green"},
              { range: [8, 9], color: "darkgreen"}

            ]
          }
        }
      ];
      
      var gaugeLayout = {
        width: 400,
        height: 300,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
      };
      Plotly.newPlot('gauge', guageData, gaugeLayout);
  });
}
// create an even handler for options changed
function optionChanged(newID)
{
    displaySampleData(newID);
    drawBargraph(newID);
    drawBubblechart(newID);
    // bonus: draw gauge chart
    drawGaugeChart(newID);
}

// create an initialize function
function initDashboard() {
    // console.log("initializing...");

    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) =>
    {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => 
        {
            selector
            .append("option")
            .text(sample)
            .property('value', sample);
        });
        var selectedID = sampleNames[0];
        displaySampleData(selectedID);
        drawBargraph(selectedID);
        drawBubblechart(selectedID); 
        // bonus: draw a gauge chart
        drawGaugeChart(selectedID);
    });

}

// initialize the display dashboard
initDashboard();