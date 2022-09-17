const req = new XMLHttpRequest();

req.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);

req.send();

req.onload = function () {
  const json = JSON.parse(req.responseText);
  const dataset = json.data;
  const yearsDate = dataset.map(d => new Date(d[0]));
  const maxX = new Date(d3.max(yearsDate));
  const minX = new Date(d3.min(yearsDate));

  const maxY = d3.max(dataset, d => d[1]) + 500;
  const minY = 0;

  const w = 950;
  const h = 500;
  const paddingX = 70;
  const paddingY = 30;

  const xScale = d3.scaleTime().domain([minX, maxX]).range([paddingX, w - paddingX]);
  const yScale = d3.scaleLinear().domain([minY, maxY]).range([h - paddingY, 0]);
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const tooltip = d3.select('#graph').append('div').attr('id', 'tooltip').style('opacity', 0);

  const svg = d3.select('#graph').append('svg').attr('width', w).attr('height', h);

  svg.append('g').attr('id', 'x-axis').call(xAxis).attr('transform', 'translate(0, ' + (h - paddingY) + ')');
  svg.append('g').attr('id', 'y-axis').call(yAxis).attr('transform', 'translate(' + paddingX + ', 0)');

  svg.selectAll('rect').
  data(dataset).
  enter().
  append('rect').
  attr('class', 'bar').
  attr('width', w / 275).
  attr('height', d => h - paddingY - yScale(d[1])).
  attr('x', d => xScale(new Date(d[0]))).
  attr('y', d => yScale(d[1])).
  attr('data-gdp', (d, i) => d[1]).
  attr('data-date', (d, i) => d[0]).
  on('mouseover', (event, setItem) => {
    tooltip.transition().duration(300).style('opacity', 0.9);
    tooltip.html(setItem[0] + '<br />' + '$ ' + setItem[1] + ' Billions').attr('data-date', setItem[0]).style('left', 250 + 'px').style('top', 300 + 'px');
  }).
  on('mouseout', (event, setItem) => {
    tooltip.transition().duration(300).style('opacity', 0);
  });
};