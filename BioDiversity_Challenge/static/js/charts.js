function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

/////////////////////////////////////
// Deliverable 1: Create a Horizontal Bar Chart (35 points)

// Step 1: Create the buildChart function.
function buildCharts(sample) {
// Step 2: Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Step 3: Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // Step 4: Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = sampleArray.filter(sampleObj => sampleObj.id ==sample);
    console.log(resultSample);  
    // Step 5: Create a variable that holds the first sample in the array.
    var firstSample = resultSample[0];
    // Step 6: Create variables that have arrays for otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    console.log(otu_ids);
    var wfreq = firstSample.wfreq
    // Step 7: Create the yticks for the bar chart.
    var top10 = (data.samples[0].otu_ids.slice(0,10)).reverse();
    var yticks = top10.map(d=>"OTU" + d);
    var xticks = data.samples[0].sample_values.slice(0,10).reverse();
    // Step 8: create the trace object for the bar chart, where the x values are the sample_values
    // and the hover text for the bars are the otu_labels in descending order.
    var barData = [{
      x: xticks,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h",
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 1,}
    }];
    // Step 9: Create a variable that holds the washing frequency.
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
       titlefont: {"size": 15},
       xaxis: {title: "Values"}
     } 
    
    // Step 10:  use the Plotly.newPlot() function to plot the trace object with the layout.
    Plotly.react("bar", barData, barLayout);

    
    /////////////////////////////////////
    // Deliverable 2: Create a Bubble Chart (30 points)

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:"markers",
      marker:{
        size: sample_values ,
        color: otu_ids,
        colorscale:' RdBu',
        sizeref: 0.20,
        sizemode: 'area',
      }, 

    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures per Sample",
      xaxis:{title:"OTU ID"},
      yaxis:{title:"Samples"},
      titlefont:{"size":22},
      hovermode:"closest",
      height: 450
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleTrace, bubbleLayout, config);

    
    /////////////////////////////////////
    //Deliverable 3: Create a Gauge Chart (20 points)

    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
      text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
      axis: { range: [null, 9],
      dtick: 2
      },
      bar: {color: "black"},
      steps: [
        {range: [0, 2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "yellowgreen"},
        {range: [8,10], color: "green"}
      ],
    },
    }];
    
    var layout = {
      title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
      width: 350,
      height: 350,
      margin: { t: 50, r: 25, l: 25, b: 25 },
    };
    Plotly.newPlot("gauge", guageData, layout);
  });
}