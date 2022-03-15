// Define init() function
function init() {
  let selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Call init() function
init();

// Define optionChanged() function
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Define buildMetadata() function
function buildMetadata(sample) {
  d3.json("../static/data/samples.json").then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("../static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    const samples = data.samples;
    const metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let samplesArray = samples.filter(
      sampleObj => sampleObj.id == sample
    );
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadataArray = metadata.filter(
      sampleObj => sampleObj.id == sample
    );
    // 5. Create a variable that holds the first sample in the array.
    let samplesResult = samplesArray[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    let metadataResult = metadataArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = samplesResult.otu_ids;
    let sampleValues = samplesResult.sample_values;
    let otuLabels = samplesResult.otu_labels;
    // 3. Create a variable that holds the washing frequency.
    let wfreq = parseInt(metadataResult.wfreq);
    console.log(otuIds);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let yticks = otuIds.map(id => "OTU " + id).slice(0, 10).reverse();
    // 8. Create the trace for the bar chart. 
    let barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      hoverlabel: { bgcolor: 'skyblue', namelength: -1 },
      type: "bar",
      orientation: 'h'
    }
    ];
    // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacterial Cultures",
      hovermode: "closest",
      font: {color: 'black'}
    };
    barConfig = {'responsive': 'true'};
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, barConfig);


    // 1. Create the trace for the bubble chart.
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size:sampleValues,
        color: otuIds,
        colorscale: "Blues"
      }
    }];
    // 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "Bacterial Cultures per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: 'closest',
      font: {color: 'black'}
    };
    bubbleConfig = {'responsive': 'true'};


    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, bubbleConfig);

    var gaugeData = [
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          type: "indicator",
          mode: "gauge+number",
          gauge: {
              bar: {color: 'black'},
              axis: { range: [0, 10] },
              steps: [
                  { range: [0, 2], color: 'rgb(222,235,247)' },
                  { range: [2, 4], color: 'rgb(158,202,225)' },
                  { range: [4, 6], color: 'rgb(66,146,198)' },
                  { range: [6, 8], color: 'rgb(33,113,181)' },
                  { range: [8, 10], color: 'rgb(8,81,156)' }
              ]
      }
    }
  ];

  // Define Plot layout
  var gaugeLayout = {
    title: "Washing Frequency",
    autosize: true,
    font: {color: 'black'}
  };

  gaugeConfig = {'responsive': 'true'};

  // Display plot
  Plotly.newPlot('gauge', gaugeData, gaugeLayout, gaugeConfig);
  });
}